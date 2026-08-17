import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import type { IssuesData } from '../types'
import { splitAnswer } from '../lib/answer'
import { ContentCard, SourceLine } from './ContentCard'
import { Markdown } from './Markdown'

type IssueViewProps = {
  issueId: string
  issues: IssuesData
}

export function IssueView({ issueId, issues }: IssueViewProps) {
  const [searchParams] = useSearchParams()
  const issue = issues[issueId]
  const from = searchParams.get('from')
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    setVisible(false)
    const id = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(id)
  }, [issueId])

  if (!issue) {
    return (
      <div className="max-w-2xl">
        <h1 className="font-display text-3xl font-bold">Not found</h1>
        <p className="mt-4 text-ink/70">No information is available for this situation yet.</p>
        <Link to="/" className="mt-6 inline-block font-medium">
          Back to start
        </Link>
      </div>
    )
  }

  const sections = splitAnswer(issue.answer)

  return (
    <article
      className={`mx-auto max-w-2xl text-left transition duration-500 ease-out ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
      }`}
    >
      <div className="mb-6">
        {from ? (
          <Link
            to={from}
            className="text-sm font-semibold text-accent no-underline hover:underline"
          >
            ← Back to situations
          </Link>
        ) : (
          <Link to="/" className="text-sm font-semibold text-accent no-underline hover:underline">
            ← Start over
          </Link>
        )}
      </div>

      <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
        {issue.title}
      </h1>
      {issue.question && issue.question !== issue.title ? (
        <p className="mt-3 text-lg leading-relaxed text-ink/75">{issue.question}</p>
      ) : null}

      <div className="mt-8 flex flex-col gap-4">
        {sections.length === 0 ? (
          <ContentCard>
            <p className="text-ink/70">No details for this topic yet.</p>
          </ContentCard>
        ) : (
          sections.map((section) => (
            <ContentCard key={section.label} pill={section.label}>
              <Markdown content={section.body} />
            </ContentCard>
          ))
        )}
      </div>

      <SourceLine source={issue.source} />
    </article>
  )
}
