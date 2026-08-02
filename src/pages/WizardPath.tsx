import { Navigate, useLocation, useParams } from 'react-router-dom'
import { Wizard } from '../components/Wizard'
import { useAppData } from '../data/useAppData'
import { parseBrowseIndices, resolvePath } from '../lib/hierarchy'

export function WizardPath() {
  const { hierarchy } = useAppData()
  const { '*': splat } = useParams()
  const location = useLocation()
  const segments = splat ? splat.split('/').filter(Boolean) : []
  const indices = parseBrowseIndices(segments)

  if (indices === null) {
    return <Navigate to="/?notice=invalid" replace state={{ from: location.pathname }} />
  }

  const resolved = resolvePath(hierarchy, indices)
  if (!resolved.ok) {
    return <Navigate to="/?notice=invalid" replace />
  }

  return <Wizard node={resolved.node} indices={indices} crumbs={resolved.crumbs} />
}
