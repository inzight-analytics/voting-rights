export type HierarchyNode = {
  title: string
  description: string
  children: Array<HierarchyNode | string>
}

export type Issue = {
  title: string
  question: string
  answer: string
  source: string
}

export type IssuesData = Record<string, Issue>

export type ExtraItem = {
  slug: string
  title: string
  answer: string
  source: string
}

export type AnswerSection = {
  label: string
  body: string
}
