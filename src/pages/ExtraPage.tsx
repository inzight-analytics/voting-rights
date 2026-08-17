import { Navigate, useParams } from 'react-router-dom'
import { HeadingBubble, LevelCanvas } from '../components/Field'
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
    <LevelCanvas header={<HeadingBubble>{item.title}</HeadingBubble>}>
      <div className="flex w-full max-w-2xl flex-col gap-6">
        <section className="rounded-xl bg-white px-5 py-4">
          {item.answer.trim() ? (
            <Markdown content={item.answer} />
          ) : (
            <p className="text-center text-ink/70">No details for this topic yet.</p>
          )}
        </section>
        {item.source.length > 0 ? (
          <div className="text-sm text-ink/55">
            <Source source={item.source} />
          </div>
        ) : null}
      </div>
    </LevelCanvas>
  )
}
