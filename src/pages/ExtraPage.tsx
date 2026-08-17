import { Link, Navigate, useParams } from 'react-router-dom'
import { ContentCard, SourceLine } from '../components/ContentCard'
import { Markdown } from '../components/Markdown'
import { useAppData } from '../data/useAppData'

export function ExtraPage() {
  const { extras } = useAppData()
  const { slug } = useParams()
  const item = extras.find((extra) => extra.slug === slug)

  if (!item) {
    return <Navigate to="/?notice=unknown-info" replace />
  }

  return (
    <article className="mx-auto max-w-2xl text-left">
      <Link to="/" className="text-sm font-semibold text-accent no-underline hover:underline">
        ← Back to start
      </Link>
      <h1 className="mt-6 font-display text-3xl font-bold tracking-tight sm:text-4xl">
        {item.title}
      </h1>

      <div className="mt-8">
        {item.answer.trim() ? (
          <ContentCard variant="pink">
            <Markdown content={item.answer} />
            <SourceLine source={item.source} />
          </ContentCard>
        ) : (
          <ContentCard variant="pink">
            <p className="text-ink/70">
              This topic is listed for reference. Detailed content will appear here when added to
              the spreadsheet.
            </p>
          </ContentCard>
        )}
      </div>
    </article>
  )
}
