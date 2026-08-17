import type { AnswerSection } from '../types'

const PREFIX = /^(Enrol|Enrolment|Vote|Voting)\s*[-–—:]\s*/i

export function splitAnswer(answer: string): AnswerSection[] {
  const text = answer.trim()
  if (!text) return []

  const chunks = text
    .split(/(?=(?:^|\n)\s*(?:Enrol(?:ment)?|Vot(?:e|ing))\s*[-–—:]\s*)/i)
    .map((chunk) => chunk.trim())
    .filter(Boolean)

  if (chunks.length <= 1 && !PREFIX.test(text)) {
    return [{ label: 'What to do', body: text }]
  }

  const sections: AnswerSection[] = []
  for (const chunk of chunks) {
    const match = chunk.match(PREFIX)
    if (!match) {
      sections.push({ label: 'What to do', body: chunk })
      continue
    }
    const raw = match[1].toLowerCase()
    const label = raw.startsWith('enrol') ? 'Enrolment' : 'Voting'
    const body = chunk.slice(match[0].length).trim()
    if (!body) continue
    const existing = sections.find((section) => section.label === label)
    if (existing) existing.body = `${existing.body}\n\n${body}`
    else sections.push({ label, body })
  }

  return sections.length ? sections : [{ label: 'What to do', body: text }]
}

export type DisplaySource = {
  href: string | null
  label: string
  note: string | null
}

export function parseSourceItem(source: string): DisplaySource {
  const trimmed = source.trim()
  if (!/^https?:\/\//i.test(trimmed)) {
    return { href: null, label: trimmed, note: null }
  }

  const space = trimmed.search(/\s/)
  const rawUrl = space === -1 ? trimmed : trimmed.slice(0, space)
  const note = space === -1 ? '' : trimmed.slice(space).trim()
  const href = rawUrl.replace(/[),.;]+$/, '')

  return { href, label: href, note: note || null }
}
