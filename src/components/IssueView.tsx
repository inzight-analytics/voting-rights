import { Link } from 'react-router-dom'
import type { Issue, IssuesData } from '../types'
import { splitAnswer } from '../lib/answer'
import { HeadingBubble, LevelCanvas, Page } from './Field'
import { Markdown, Source } from './Markdown'

type AdviceKind = 'general' | 'enrol' | 'vote'

const SURFACES: Record<AdviceKind, string> = {
  general: 'bg-white',
  enrol: 'bg-mint',
  vote: 'bg-peach',
}

const LABELS: Record<AdviceKind, string> = {
  general: 'General',
  enrol: 'Enrolment',
  vote: 'Voting',
}

function adviceSections(issue: Issue): Array<{ kind: AdviceKind; body: string }> {
  if (issue.enrol || issue.vote) {
    return [
      ...(issue.answer?.trim() ? [{ kind: 'general' as const, body: issue.answer }] : []),
      ...(issue.enrol ? [{ kind: 'enrol' as const, body: issue.enrol }] : []),
      ...(issue.vote ? [{ kind: 'vote' as const, body: issue.vote }] : []),
    ]
  }

  return splitAnswer(issue.answer ?? '').map((section) => {
    if (section.label === 'Enrolment') return { kind: 'enrol' as const, body: section.body }
    if (section.label === 'Voting') return { kind: 'vote' as const, body: section.body }
    return { kind: 'general' as const, body: section.body }
  })
}

export function IssueAdvice({ issue }: { issue: Issue }) {
  const sections = adviceSections(issue)

  return (
    <LevelCanvas
      header={
        <>
          <p className="text-center font-bold">What&rsquo;s the issue?</p>
          <HeadingBubble>{issue.title}</HeadingBubble>
        </>
      }
    >
      <div className="flex w-full max-w-2xl flex-col gap-6">
        {sections.length === 0 ? (
          <p className="text-center text-ink/70">No details for this topic yet.</p>
        ) : (
          sections.map((section) => (
            <section key={section.kind} className={`rounded-xl px-5 py-4 ${SURFACES[section.kind]}`}>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-ink/50">
                {LABELS[section.kind]}
              </h2>
              <div className="mt-2">
                <Markdown content={section.body} />
              </div>
            </section>
          ))
        )}
        {issue.source.length > 0 ? (
          <div className="text-sm text-ink/55">
            <Source source={issue.source} />
          </div>
        ) : null}
      </div>
    </LevelCanvas>
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

  return <IssueAdvice issue={issue} />
}
