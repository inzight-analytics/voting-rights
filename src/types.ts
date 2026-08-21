export type Issue = {
  slug: string
  title: string
  question: string
  answer?: string
  enrol?: string
  vote?: string
  source: string[]
}

export type HierarchyNode = {
  title: string
  description: string
  children: Array<HierarchyNode | Issue>
}

export type IssuesData = Record<string, Issue>

export type ExtraItem = {
  key: string
  title: string
  summary: string
  answer: string
  source: string[]
}

export type AnswerSection = {
  label: string
  body: string
}

export type TreeNode = HierarchyNode | Issue
