import extrasJson from './extras.json'
import hierarchyJson from './hierarchy.json'
import type { ExtraItem, HierarchyNode, Issue, IssuesData } from '../types'

function isIssue(node: HierarchyNode | Issue): node is Issue {
  return !('children' in node)
}

function flattenIssues(node: HierarchyNode, map: IssuesData): void {
  for (const child of node.children) {
    if (isIssue(child)) map[child.slug] = child
    else flattenIssues(child, map)
  }
}

const hierarchy = hierarchyJson as HierarchyNode
const issues: IssuesData = {}
flattenIssues(hierarchy, issues)

export type AppData = {
  hierarchy: HierarchyNode
  issues: IssuesData
  extras: ExtraItem[]
}

export const appData: AppData = {
  hierarchy,
  issues,
  extras: extrasJson as ExtraItem[],
}
