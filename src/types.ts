export const MARKDOWN_FIELDS = [
  'Examples',
  'Solution',
  'Electoral Commission website',
  'Electoral Act',
  'Independent Electoral Review',
  "Andrew Geddis' Textbook",
  'General Google',
] as const

export type MarkdownField = (typeof MARKDOWN_FIELDS)[number]

export type TopicFields = Partial<Record<MarkdownField, string>> & {
  Author?: string
}

export type TopicKey = 'General' | 'ENROLMENT' | 'TURNOUT'

export type IssuesData = Record<string, Partial<Record<TopicKey | string, TopicFields>>>

export type HierarchyNode = {
  title: string
  description: string
  children: Array<HierarchyNode | string>
}

export type ExtraItem = {
  issue: string
  slug: string
  topic: string
  fields: TopicFields
}

export const TOPIC_QUERY: Record<string, TopicKey> = {
  general: 'General',
  enrolment: 'ENROLMENT',
  turnout: 'TURNOUT',
}

export const TOPIC_PARAM: Record<TopicKey, string> = {
  General: 'general',
  ENROLMENT: 'enrolment',
  TURNOUT: 'turnout',
}

export const TOPIC_LABEL: Record<TopicKey, string> = {
  General: 'General',
  ENROLMENT: 'Enrolment',
  TURNOUT: 'Turnout',
}

export const FIELD_LABEL: Record<MarkdownField, string> = {
  Examples: 'Examples',
  Solution: 'What to do',
  'Electoral Commission website': 'Electoral Commission',
  'Electoral Act': 'Electoral Act',
  'Independent Electoral Review': 'Independent Electoral Review',
  "Andrew Geddis' Textbook": "Andrew Geddis' Textbook",
  'General Google': 'Further reading',
}
