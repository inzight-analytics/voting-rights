import type { HierarchyNode, Issue, TreeNode } from '../types'

export function isBranch(node: TreeNode): node is HierarchyNode {
  return 'children' in node
}

export function isIssue(node: TreeNode): node is Issue {
  return !('children' in node)
}

export function childLabel(child: TreeNode): string {
  return child.title.replace(/\s+/g, ' ').trim()
}

/** Column-C example from the first leaf under a barrier group. */
export function firstIssueQuestion(node: TreeNode): string | undefined {
  if (!isBranch(node) || node.children.length === 0) return undefined
  const first = node.children[0]
  if (!isIssue(first)) return undefined
  const question = first.question.replace(/\s+/g, ' ').trim()
  return question || undefined
}

export type ResolvedPath =
  | { ok: true; node: TreeNode; crumbs: Array<{ title: string; path: number[] }> }
  | { ok: false; reason: 'invalid' }

export function resolvePath(root: HierarchyNode, indices: number[]): ResolvedPath {
  let node: TreeNode = root
  const crumbs: Array<{ title: string; path: number[] }> = [{ title: root.title, path: [] }]

  for (let i = 0; i < indices.length; i++) {
    if (!isBranch(node)) return { ok: false, reason: 'invalid' }
    const child: TreeNode | undefined = node.children[indices[i]]
    if (child === undefined) return { ok: false, reason: 'invalid' }
    node = child
    crumbs.push({ title: node.title, path: indices.slice(0, i + 1) })
  }

  return { ok: true, node, crumbs }
}

export function parseBrowseIndices(segments: string[] | undefined): number[] | null {
  if (!segments?.length) return []
  const indices: number[] = []
  for (const segment of segments) {
    if (!/^\d+$/.test(segment)) return null
    indices.push(Number(segment))
  }
  return indices
}

export function browsePath(indices: number[]): string {
  return indices.length ? `/${indices.join('/')}` : '/'
}
