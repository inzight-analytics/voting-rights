import { useEffect, useState } from 'react'
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Shell } from './components/Shell'
import { DataProvider } from './data/DataContext'
import { loadAppData, type AppData } from './data/load'
import { ExtraPage } from './pages/ExtraPage'
import { HomeNotice } from './pages/HomeNotice'
import { IssuePage } from './pages/IssuePage'
import { WizardPath } from './pages/WizardPath'

export default function App() {
  const [data, setData] = useState<AppData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadAppData()
      .then(setData)
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Failed to load data')
      })
  }, [])

  if (error) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="font-display text-2xl font-semibold">Could not load content</h1>
        <p className="mt-3 text-ink/70">{error}</p>
        <p className="mt-2 text-sm text-ink/50">Run npm run build:data, then reload.</p>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center text-ink/60">Loading…</div>
    )
  }

  return (
    <DataProvider data={data}>
      <HashRouter>
        <Routes>
          <Route element={<Shell extras={data.extras} />}>
            <Route index element={<HomeNotice />} />
            <Route path="browse/*" element={<WizardPath />} />
            <Route path="issue/:name" element={<IssuePage />} />
            <Route path="info/:slug" element={<ExtraPage />} />
            <Route path="*" element={<Navigate to="/?notice=invalid" replace />} />
          </Route>
        </Routes>
      </HashRouter>
    </DataProvider>
  )
}
