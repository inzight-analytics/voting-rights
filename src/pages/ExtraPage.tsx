import { Link, Navigate, useParams } from 'react-router-dom'
import { Markdown } from '../components/Markdown'
import { useAppData } from '../data/useAppData'
import { FIELD_LABEL, MARKDOWN_FIELDS } from '../types'

export function ExtraPage() {
  const { extras } = useAppData()
  const { slug } = useParams()
  const item = extras.find((extra) => extra.slug === slug)

  if (!item) {
    return <Navigate to="/?notice=unknown-info" replace />
  }

  const hasContent = MARKDOWN_FIELDS.some((field) => item.fields[field]?.trim())

  return (
    <article className="max-w-2xl">
      <Link to="/" className="text-sm font-medium text-accent no-underline hover:underline">
        ← Back to start
      </Link>
      <h1 className="mt-6 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
        {item.issue.trim()}
      </h1>

      <div className="mt-8 space-y-8">
        {hasContent ? (
          MARKDOWN_FIELDS.map((field) => {
            const content = item.fields[field]
            if (!content?.trim()) return null
            return (
              <section key={field}>
                <h2 className="mb-2 font-display text-xl font-semibold">{FIELD_LABEL[field]}</h2>
                <Markdown content={content} />
              </section>
            )
          })
        ) : (
          <p className="text-ink/65">
            This topic is listed for reference. Detailed content will appear here when added to the
            data sheet.
          </p>
        )}
      </div>
    </article>
  )
}
