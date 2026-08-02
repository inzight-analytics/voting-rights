import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  FIELD_LABEL,
  MARKDOWN_FIELDS,
  TOPIC_LABEL,
  TOPIC_PARAM,
  TOPIC_QUERY,
  type IssuesData,
  type TopicKey,
  type TopicFields,
} from '../types'
import { Markdown } from './Markdown'

const TOPIC_ORDER: TopicKey[] = ['General', 'ENROLMENT', 'TURNOUT']

function topicHasContent(fields: TopicFields | undefined): boolean {
  if (!fields) return false
  return MARKDOWN_FIELDS.some((key) => Boolean(fields[key]?.trim()))
}

type IssueViewProps = {
  issueName: string
  issues: IssuesData
}

export function IssueView({ issueName, issues }: IssueViewProps) {
  const [searchParams, setSearchParams] = useSearchParams()
  const issue = issues[issueName]
  const from = searchParams.get('from')

  const availableTopics = useMemo(
    () => TOPIC_ORDER.filter((topic) => topicHasContent(issue?.[topic])),
    [issue],
  )

  const requested = TOPIC_QUERY[searchParams.get('topic') ?? '']
  const activeTopic =
    (requested && availableTopics.includes(requested) ? requested : availableTopics[0]) ?? null

  const [panelVisible, setPanelVisible] = useState(true)

  useEffect(() => {
    setPanelVisible(false)
    const id = requestAnimationFrame(() => setPanelVisible(true))
    return () => cancelAnimationFrame(id)
  }, [activeTopic, issueName])

  if (!issue || availableTopics.length === 0) {
    return (
      <div className="max-w-2xl">
        <h1 className="font-display text-3xl font-semibold">{issueName.trim()}</h1>
        <p className="mt-4 text-ink/70">No information is available for this situation yet.</p>
        <Link to="/" className="mt-6 inline-block font-medium">
          Back to start
        </Link>
      </div>
    )
  }

  const fields = activeTopic ? issue[activeTopic] : undefined

  function selectTopic(topic: TopicKey) {
    const next = new URLSearchParams(searchParams)
    next.set('topic', TOPIC_PARAM[topic])
    setSearchParams(next, { replace: true })
  }

  return (
    <article className="max-w-2xl">
      <div className="mb-6">
        {from ? (
          <Link
            to={from}
            className="text-sm font-medium text-accent no-underline hover:underline"
          >
            ← Back to situations
          </Link>
        ) : (
          <Link to="/" className="text-sm font-medium text-accent no-underline hover:underline">
            ← Start over
          </Link>
        )}
      </div>

      <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
        {issueName.replace(/\s+/g, ' ').trim()}
      </h1>

      {availableTopics.length > 1 ? (
        <div
          role="tablist"
          aria-label="Information topics"
          className="mt-8 flex flex-wrap gap-2 border-b border-ink/10 pb-px"
        >
          {availableTopics.map((topic) => {
            const selected = topic === activeTopic
            return (
              <button
                key={topic}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => selectTopic(topic)}
                className={`border-b-2 px-3 py-2 text-sm font-semibold transition ${
                  selected
                    ? 'border-accent text-accent'
                    : 'border-transparent text-ink/55 hover:text-ink'
                }`}
              >
                {TOPIC_LABEL[topic]}
              </button>
            )
          })}
        </div>
      ) : (
        <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-accent">
          {activeTopic ? TOPIC_LABEL[activeTopic] : null}
        </p>
      )}

      <div
        role="tabpanel"
        className={`mt-8 space-y-8 transition duration-300 ${
          panelVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {fields
          ? MARKDOWN_FIELDS.map((field) => {
              const content = fields[field]
              if (!content?.trim()) return null
              return (
                <section key={field}>
                  <h2 className="mb-2 font-display text-xl font-semibold text-ink">
                    {FIELD_LABEL[field]}
                  </h2>
                  <Markdown content={content} />
                </section>
              )
            })
          : null}

        {fields && !MARKDOWN_FIELDS.some((field) => fields[field]?.trim()) ? (
          <p className="text-ink/65">No details for this topic yet.</p>
        ) : null}
      </div>
    </article>
  )
}
