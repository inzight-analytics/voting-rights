import type { ExtraItem, HierarchyNode, IssuesData } from '../types'

const base = import.meta.env.BASE_URL

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(`${base}data/${path}`)
  if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`)
  return res.json() as Promise<T>
}

export type AppData = {
  hierarchy: HierarchyNode
  issues: IssuesData
  extras: ExtraItem[]
}

export function loadAppData(): Promise<AppData> {
  return Promise.all([
    fetchJson<HierarchyNode>('hierarchy.json'),
    fetchJson<IssuesData>('issues.json'),
    fetchJson<ExtraItem[]>('extras.json'),
  ]).then(([hierarchy, issues, extras]) => ({ hierarchy, issues, extras }))
}
