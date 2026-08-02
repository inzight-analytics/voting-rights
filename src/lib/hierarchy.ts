import type { HierarchyNode } from '../types'

export function isBranch(child: HierarchyNode | string): child is HierarchyNode {
  return typeof child === 'object' && child !== null
}

export function childLabel(child: HierarchyNode | string): string {
  return isBranch(child) ? child.title : child.replace(/\s+/g, ' ').trim()
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
