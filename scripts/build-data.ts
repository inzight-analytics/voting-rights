/**
 * Parse the "tidied again" Google Sheet export (data/sheet.csv).
 *
 * Columns:
 *   A TOP LEVEL
 *   B BARRIERS          (extras section: Key)
 *   C EXAMPLES          (THESE SIT NEXT TO BARRIERS / EXAMPLES)
 *   D SPECIFIC ISSUES   (extras section: Summary)
 *   E ANSWER            (extras section: Description)
 *   F Source?
 *
 * Outline rules (empty cells inherit the current parent):
 *   1. First A-only row is the root question (e.g. "Are you...").
 *   2. A + B, no D/E                → top-level branch. Title=A, description=B.
 *      (B that looks like a key id is treated as an extra instead.)
 *   3. A + C, no B/D/E              → stub top-level branch. Title=A, description=C.
 *   4. A otherwise                  → additional question (FAQ / term).
 *                                     Title=A, key=B or slug(A), summary=D, answer=E, source=F.
 *   5. B (A empty)                  → barrier group under current top-level.
 *                                     Title = D or B.
 *   6. C and/or D (A and B empty)   → leaf issue under current barrier.
 *                                     title=D or C, question=C, answer=E, source=F.
 *
 * Canonical app data is two files:
 *   src/data/hierarchy.json  — tree with issues nested as leaves
 *     leaves: { slug, title, question, enrol?, vote?, answer?, source[] }
 *     Enrol -/Vote - prefixes become enrol/vote; leftover text stays in answer
 *   src/data/extras.json     — additional questions / glossary terms
 *     { key, title, summary, answer, source[] }
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parse } from 'csv-parse/sync'

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '..')
const appDataDir = join(rootDir, 'src', 'data')

type SheetRow = {
  'TOP LEVEL': string
  BARRIERS: string
  EXAMPLES?: string
  'THESE SIT NEXT TO BARRIERS'?: string
  'SPECIFIC ISSUES': string
  ANSWER: string
  'Source?': string
}

type IssueLeaf = {
  slug: string
  title: string
  question: string
  answer?: string
  enrol?: string
  vote?: string
  source: string[]
}

type HierarchyNode = {
  title: string
  description: string
  children: Array<HierarchyNode | IssueLeaf>
}

type ExtraItem = {
  key: string
  title: string
  summary: string
  answer: string
  source: string[]
}

function parseSources(value: string): string[] {
  return value
    .split(/\s+&\s*/)
    .map((item) => item.trim())
    .filter(Boolean)
}

function cell(row: SheetRow, key: keyof SheetRow): string {
  return (row[key] ?? '').replace(/\r\n/g, '\n').trim()
}

function examplesCell(row: SheetRow): string {
  return cell(row, 'EXAMPLES') || cell(row, 'THESE SIT NEXT TO BARRIERS')
}

function slugify(value: string): string {
  const slug = value
    .trim()
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  return slug || 'item'
}

function uniqueSlug(base: string, used: Set<string>): string {
  let slug = slugify(base)
  if (!used.has(slug)) {
    used.add(slug)
    return slug
  }
  let n = 2
  while (used.has(`${slug}-${n}`)) n += 1
  slug = `${slug}-${n}`
  used.add(slug)
  return slug
}

/** Short id used in [[key]] links, e.g. special-vote */
function isKeyLike(value: string): boolean {
  return /^[a-z][a-z0-9_-]*$/i.test(value) && value.length <= 64
}

function isExtrasLegend(barrier: string, specific: string, answer: string): boolean {
  return (
    barrier.toLowerCase() === 'key' &&
    specific.toLowerCase() === 'summary' &&
    answer.toLowerCase() === 'description'
  )
}

const PREFIX = /^(Enrol|Enrolment|Vote|Voting)\s*[-–—:]\s*/i

function splitAnswerFields(text: string): Pick<IssueLeaf, 'answer' | 'enrol' | 'vote'> {
  const trimmed = text.trim()
  if (!trimmed) return {}

  const chunks = trimmed
    .split(/(?=(?:^|\n)\s*(?:Enrol(?:ment)?|Vot(?:e|ing))\s*[-–—:]\s*)/i)
    .map((chunk) => chunk.trim())
    .filter(Boolean)

  if (chunks.length <= 1 && !PREFIX.test(trimmed)) {
    return { answer: trimmed }
  }

  const result: Pick<IssueLeaf, 'answer' | 'enrol' | 'vote'> = {}
  for (const chunk of chunks) {
    const match = chunk.match(PREFIX)
    if (!match) {
      result.answer = result.answer ? `${result.answer}\n\n${chunk}` : chunk
      continue
    }
    const key = match[1].toLowerCase().startsWith('enrol') ? 'enrol' : 'vote'
    const body = chunk.slice(match[0].length).trim()
    if (!body) continue
    result[key] = result[key] ? `${result[key]}\n\n${body}` : body
  }
  return result
}

function isIssue(node: HierarchyNode | IssueLeaf): node is IssueLeaf {
  return 'slug' in node && !('children' in node)
}

function countLeaves(node: HierarchyNode): number {
  let n = 0
  for (const child of node.children) {
    n += isIssue(child) ? 1 : countLeaves(child)
  }
  return n
}

function writeJson(path: string, data: unknown): void {
  writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`)
}

const csvText = readFileSync(join(rootDir, 'data', 'sheet.csv'), 'utf8')
const rows = parse(csvText, {
  columns: true,
  skip_empty_lines: false,
  relax_quotes: true,
  relax_column_count: true,
  trim: false,
}) as SheetRow[]

const extras: ExtraItem[] = []
const usedSlugs = new Set<string>()
const usedKeys = new Set<string>()

const hierarchy: HierarchyNode = {
  title: 'Are you...',
  description: '',
  children: [],
}

let currentTop: HierarchyNode | null = null
let currentBarrier: HierarchyNode | null = null
let sawRoot = false

function pushExtra(title: string, keyCell: string, summary: string, answer: string, source: string[]) {
  const key = uniqueSlug(keyCell || title, usedKeys)
  usedSlugs.add(key)
  extras.push({
    key,
    title,
    summary,
    answer,
    source,
  })
}

for (const row of rows) {
  const top = cell(row, 'TOP LEVEL')
  const barrier = cell(row, 'BARRIERS')
  const question = examplesCell(row)
  const specific = cell(row, 'SPECIFIC ISSUES')
  const answer = cell(row, 'ANSWER')
  const source = parseSources(cell(row, 'Source?'))

  if (!top && !barrier && !question && !specific && !answer && source.length === 0) continue

  if (!top && isExtrasLegend(barrier, specific, answer)) continue

  if (top) {
    if (!sawRoot && !barrier && !question && !specific && !answer) {
      hierarchy.title = top
      sawRoot = true
      currentTop = null
      currentBarrier = null
      continue
    }

    // A + B with no D/E → top-level branch, unless B is a glossary key.
    if (barrier && !specific && !answer && !isKeyLike(barrier)) {
      currentTop = { title: top, description: barrier, children: [] }
      currentBarrier = null
      hierarchy.children.push(currentTop)
      sawRoot = true
      continue
    }

    if (question && !barrier && !specific && !answer) {
      currentTop = { title: top, description: question, children: [] }
      currentBarrier = null
      hierarchy.children.push(currentTop)
      sawRoot = true
      continue
    }

    pushExtra(top, barrier, specific, answer, source)
    currentTop = null
    currentBarrier = null
    continue
  }

  if (barrier) {
    if (!currentTop) {
      throw new Error(`Barrier ${JSON.stringify(barrier)} has no parent top-level row`)
    }
    const title = specific || barrier
    const description = specific && specific !== barrier ? barrier : ''
    currentBarrier = { title, description, children: [] }
    currentTop.children.push(currentBarrier)
    continue
  }

  if (question || specific) {
    if (!currentBarrier) {
      throw new Error(
        `Issue ${JSON.stringify(specific || question)} has no parent barrier row`,
      )
    }
    const title = specific || question
    currentBarrier.children.push({
      slug: uniqueSlug(title, usedSlugs),
      title,
      question,
      ...splitAnswerFields(answer),
      source,
    })
  }
}

mkdirSync(appDataDir, { recursive: true })
writeJson(join(appDataDir, 'hierarchy.json'), hierarchy)
writeJson(join(appDataDir, 'extras.json'), extras)

console.log(
  `Wrote ${countLeaves(hierarchy)} nested issues, ${hierarchy.children.length} top-level branches, ${extras.length} additional questions`,
)
