import { Link, Navigate, useParams } from 'react-router-dom'
import { Field, Page } from '../components/Field'
import { Markdown, Source } from '../components/Markdown'
import { useAppData } from '../data/useAppData'

export function ExtraPage() {
  const { extras } = useAppData()
  const { slug } = useParams()
  const item = extras.find((extra) => extra.slug === slug)

  if (!item) {
    return <Navigate to="/?notice=unknown-info" replace />
  }

  return (
    <Page>
      <Link to="/">← Back to start</Link>
      <h1 className="font-display text-3xl font-bold tracking-tight">{item.title}</h1>
      {item.answer.trim() ? (
        <Field label="Answer">
          <Markdown content={item.answer} />
        </Field>
      ) : (
        <p className="text-ink/70">No details for this topic yet.</p>
      )}
      <Field label="Source">
        {item.source.trim() ? <Source source={item.source} /> : <p className="text-ink/55">—</p>}
      </Field>
    </Page>
  )
}
