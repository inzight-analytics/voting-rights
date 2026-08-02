import { Navigate, useParams } from 'react-router-dom'
import { IssueView } from '../components/IssueView'
import { useAppData } from '../data/useAppData'

export function IssuePage() {
  const { issues } = useAppData()
  const { name } = useParams()
  const issueName = name ? decodeURIComponent(name) : ''

  if (!issueName || !issues[issueName]) {
    return <Navigate to="/?notice=unknown-issue" replace />
  }

  return <IssueView issueName={issueName} issues={issues} />
}
