import type { HierarchyNode, IssuesData } from '../types'

export function isBranch(child: HierarchyNode | string): child is HierarchyNode {
  return typeof child === 'object' && child !== null
}

export function childLabel(child: HierarchyNode | string): string {
  return isBranch(child) ? child.title : child.replace(/\s+/g, ' ').trim()
}

function tidyLabel(value: string): string {
  return value.replace(/\s+/g, ' ').trim().replace(/[.,;]+$/, '')
}

function joinEnglish(parts: string[]): string {
  if (parts.length === 1) return parts[0]
  if (parts.length === 2) return `${parts[0]}, or ${parts[1]}`
  return `${parts.slice(0, -1).join(', ')}, or ${parts[parts.length - 1]}`
}

/** Sticky-note copy beside a barrier — the specific-issue titles, kept short. */
export function barrierNote(node: HierarchyNode, issues: IssuesData): string | null {
  const titles: string[] = []

  for (const child of node.children) {
    if (typeof child !== 'string') continue
    const title = issues[child]?.title
    if (title) titles.push(tidyLabel(title))
  }

  if (!titles.length) return null

  const kept: string[] = []
  for (const title of titles) {
    const next = joinEnglish([...kept, title])
    if (kept.length > 0 && next.length > 110) break
    kept.push(title)
  }

  let text = joinEnglish(kept)
  if (kept.length < titles.length) text += '…'
  return text
}

export type ResolvedPath =
  | { ok: true; node: HierarchyNode; crumbs: Array<{ title: string; path: number[] }> }
  | { ok: false; reason: 'invalid' }

export function resolvePath(root: HierarchyNode, indices: number[]): ResolvedPath {
  let node = root
  const crumbs: Array<{ title: string; path: number[] }> = [
    { title: root.title, path: [] },
  ]

  for (let i = 0; i < indices.length; i++) {
    const index = indices[i]
    const child = node.children[index]
    if (child === undefined || !isBranch(child)) {
      return { ok: false, reason: 'invalid' }
    }
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
  return indices.length ? `/browse/${indices.join('/')}` : '/'
}
