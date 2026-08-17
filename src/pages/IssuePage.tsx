import { Navigate, useParams } from 'react-router-dom'
import { IssueView } from '../components/IssueView'
import { useAppData } from '../data/useAppData'

export function IssuePage() {
  const { issues } = useAppData()
  const { name } = useParams()
  const issueId = name ? decodeURIComponent(name) : ''

  if (!issueId || !issues[issueId]) {
    return <Navigate to="/?notice=unknown-issue" replace />
  }

  return <IssueView issueId={issueId} issues={issues} />
}
