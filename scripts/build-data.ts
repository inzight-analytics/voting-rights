import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parse } from 'csv-parse/sync'
import { parse as parseYaml } from 'yaml'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = join(root, 'public', 'data')

const MARKDOWN_FIELDS = [
  'Examples',
  'Solution',
  'Electoral Commission website',
  'Electoral Act',
  'Independent Electoral Review',
  "Andrew Geddis' Textbook",
  'General Google',
] as const

type MarkdownField = (typeof MARKDOWN_FIELDS)[number]

type TopicFields = Partial<Record<MarkdownField, string>> & {
  Author?: string
}

type HierarchyNode = {
  title: string
  description: string
  children: Array<HierarchyNode | string>
}

type CsvRow = {
  Type: string
  Issue: string
  Topic: string
  Author: string
} & Partial<Record<MarkdownField, string>>

function collectLeaves(node: HierarchyNode, leaves: string[] = []): string[] {
  for (const child of node.children ?? []) {
    if (typeof child === 'string') leaves.push(child)
    else collectLeaves(child, leaves)
  }
  return leaves
}

const csvText = readFileSync(join(root, 'data', 'core.csv'), 'utf8')
const rows = parse(csvText, {
  columns: true,
  skip_empty_lines: true,
  relax_quotes: true,
  relax_column_count: true,
}) as CsvRow[]

const issues: Record<string, Record<string, TopicFields>> = {}
const issueTypes = new Map<string, Set<string>>()
const extras: Array<{
  issue: string
  slug: string
  topic: string
  fields: TopicFields
}> = []

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

for (const row of rows) {
  const type = (row.Type ?? '').trim().toLowerCase()
  const issue = row.Issue ?? ''
  if (!issue) continue

  const fields: TopicFields = {}
  if (row.Author?.trim()) fields.Author = row.Author.trim()
  for (const key of MARKDOWN_FIELDS) {
    const value = row[key]?.trim()
    if (value) fields[key] = value
  }

  if (type === 'core' || type === 'summary') {
    const topic = (row.Topic || 'General').trim()
    if (!issues[issue]) issues[issue] = {}
    issues[issue][topic] = { ...issues[issue][topic], ...fields }
    if (!issueTypes.has(issue)) issueTypes.set(issue, new Set())
    issueTypes.get(issue)!.add(type)
  } else if (type === 'general' || type === 'question') {
    extras.push({
      issue,
      slug: slugify(issue),
      topic: row.Topic ?? '',
      fields,
    })
  }
}

const hierarchy = parseYaml(
  readFileSync(join(root, 'data', 'hierarchy.yaml'), 'utf8'),
) as HierarchyNode

if (!hierarchy?.title || !Array.isArray(hierarchy.children)) {
  throw new Error('hierarchy.yaml must have title, description, and children')
}

const leaves = collectLeaves(hierarchy)
const knownIssues = new Set(
  [...issueTypes.entries()]
    .filter(([, types]) => types.has('core') || types.has('summary'))
    .map(([issue]) => issue),
)

const missing: string[] = []
for (const leaf of leaves) {
  if (!knownIssues.has(leaf)) missing.push(leaf)
}
if (missing.length) {
  console.error('Hierarchy leaves with no matching core/summary Issue:')
  for (const leaf of missing) console.error(`  - ${JSON.stringify(leaf)}`)
  process.exit(1)
}

const referenced = new Set(leaves)
const unused = [...knownIssues].filter((issue) => !referenced.has(issue))
if (unused.length) {
  console.warn('Issues not referenced in hierarchy.yaml:')
  for (const issue of unused) console.warn(`  - ${JSON.stringify(issue)}`)
}

mkdirSync(outDir, { recursive: true })
writeFileSync(join(outDir, 'issues.json'), JSON.stringify(issues, null, 2))
writeFileSync(join(outDir, 'hierarchy.json'), JSON.stringify(hierarchy, null, 2))
writeFileSync(join(outDir, 'extras.json'), JSON.stringify(extras, null, 2))

console.log(
  `Wrote ${Object.keys(issues).length} issues, ${leaves.length} hierarchy leaves, ${extras.length} extras → public/data/`,
)
