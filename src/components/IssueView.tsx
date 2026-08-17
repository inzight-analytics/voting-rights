import { Link } from 'react-router-dom'
import type { Issue, IssuesData } from '../types'
import { splitAnswer } from '../lib/answer'
import { Field, Page } from './Field'
import { Markdown, Source } from './Markdown'

export function IssueFields({ issue }: { issue: Issue }) {
  const sections =
    issue.enrol || issue.vote
      ? [
          ...(issue.enrol ? [{ label: 'Enrolment', body: issue.enrol }] : []),
          ...(issue.vote ? [{ label: 'Voting', body: issue.vote }] : []),
          ...(issue.answer?.trim() ? [{ label: 'What to do', body: issue.answer }] : []),
        ]
      : splitAnswer(issue.answer ?? '')

  return (
    <>
      {issue.question && issue.question !== issue.title ? (
        <Field label="Question">
          <p>{issue.question}</p>
        </Field>
      ) : null}

      {sections.length === 0 ? (
        <p className="text-ink/70">No details for this topic yet.</p>
      ) : (
        sections.map((section) => (
          <Field key={section.label} label={section.label}>
            <Markdown content={section.body} />
          </Field>
        ))
      )}

      <Field label="Source">
        {issue.source.trim() ? <Source source={issue.source} /> : <p className="text-ink/55">—</p>}
      </Field>
    </>
  )
}

export function IssueView({ issueId, issues }: { issueId: string; issues: IssuesData }) {
  const issue = issues[issueId]

  if (!issue) {
    return (
      <Page>
        <h1 className="font-display text-3xl font-bold tracking-tight">Not found</h1>
        <p>No information is available for this situation yet.</p>
        <Link to="/">Back to start</Link>
      </Page>
    )
  }

  return (
    <Page>
      <h1 className="font-display text-3xl font-bold tracking-tight">{issue.title}</h1>
      <IssueFields issue={issue} />
    </Page>
  )
}
