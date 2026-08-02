import { type ReactNode } from 'react'
import type { AppData } from './load'
import { DataContext } from './context'

export function DataProvider({
  data,
  children,
}: {
  data: AppData
  children: ReactNode
}) {
  return <DataContext.Provider value={data}>{children}</DataContext.Provider>
}
