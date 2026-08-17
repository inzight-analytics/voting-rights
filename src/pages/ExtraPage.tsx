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
      <p>
        <Link to="/info">← Back</Link>
      </p>
      <h1 className="font-display text-3xl font-bold tracking-tight">{item.title}</h1>
      <Field label="Slug">
        <p>{item.slug || '—'}</p>
      </Field>
      <Field label="Answer">
        {item.answer.trim() ? (
          <Markdown content={item.answer} />
        ) : (
          <p className="text-ink/55">—</p>
        )}
      </Field>
      <Field label="Source">
        {item.source.trim() ? <Source source={item.source} /> : <p className="text-ink/55">—</p>}
      </Field>
    </Page>
  )
}
