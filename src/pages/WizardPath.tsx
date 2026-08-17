import { Navigate, useLocation } from 'react-router-dom'
import { Wizard } from '../components/Wizard'
import { useAppData } from '../data/useAppData'
import { parseBrowseIndices, resolvePath } from '../lib/hierarchy'

export function WizardPath() {
  const { hierarchy } = useAppData()
  const location = useLocation()
  const segments = location.pathname.split('/').filter(Boolean)
  const indices = parseBrowseIndices(segments)

  if (indices === null || indices.length === 0) {
    return <Navigate to="/?notice=invalid" replace state={{ from: location.pathname }} />
  }

  const resolved = resolvePath(hierarchy, indices)
  if (!resolved.ok) {
    return <Navigate to="/?notice=invalid" replace />
  }

  return <Wizard node={resolved.node} indices={indices} crumbs={resolved.crumbs} />
}
