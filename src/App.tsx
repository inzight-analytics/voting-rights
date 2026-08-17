import { useEffect } from 'react'
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom'
import { Shell } from './components/Shell'
import { ExtraIndex } from './pages/ExtraIndex'
import { ExtraPage } from './pages/ExtraPage'
import { HomeNotice } from './pages/HomeNotice'
import { IssuePage } from './pages/IssuePage'
import { WizardPath } from './pages/WizardPath'

const basename = import.meta.env.BASE_URL.replace(/\/$/, '')

/** Old HashRouter bookmarks (`#/browse/0`) become path URLs. */
function LegacyHashRedirect() {
  const navigate = useNavigate()

  useEffect(() => {
    const hash = window.location.hash
    if (!hash.startsWith('#/')) return

    const [path, search] = hash.slice(1).split('?')
    const pathname = path.replace(/^\/browse(?=\/|$)/, '') || '/'
    navigate(
      { pathname, search: search ? `?${search}` : '', hash: '' },
      { replace: true },
    )
  }, [navigate])

  return null
}

export default function App() {
  return (
    <BrowserRouter basename={basename || undefined}>
      <LegacyHashRedirect />
      <Routes>
        <Route element={<Shell />}>
          <Route index element={<HomeNotice />} />
          <Route path="issue/:name" element={<IssuePage />} />
          <Route path="info" element={<ExtraIndex />} />
          <Route path="info/:slug" element={<ExtraPage />} />
          <Route path="*" element={<WizardPath />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
