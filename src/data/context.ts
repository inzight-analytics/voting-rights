import { createContext } from 'react'
import type { AppData } from './load'

export const DataContext = createContext<AppData | null>(null)
