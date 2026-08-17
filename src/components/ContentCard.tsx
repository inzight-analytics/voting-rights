import type { ReactNode } from 'react'
import { sourceHref } from '../lib/answer'

type ContentCardProps = {
  title?: string
  children: ReactNode
  variant?: 'peach' | 'pink'
  pill?: string
}

export function ContentCard({
  title,
  children,
  variant = 'peach',
  pill,
}: ContentCardProps) {
  const surface = variant === 'pink' ? 'bg-pink' : 'bg-peach'

  return (
    <section className={`rounded-2xl ${surface} px-5 py-5 shadow-sm`}>
      {pill ? (
        <p className="mb-4 inline-block rounded-full bg-white px-3 py-1 text-sm font-semibold text-ink">
          {pill}
        </p>
      ) : null}
      {title ? <h2 className="mb-3 text-lg font-bold text-ink">{title}</h2> : null}
      {children}
    </section>
  )
}

export function SourceLine({ source }: { source: string }) {
  if (!source.trim()) return null
  const href = sourceHref(source)

  return (
    <p className="mt-4 text-sm text-ink/65">
      Source:{' '}
      {href ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className="break-all">
          {source}
        </a>
      ) : (
        source
      )}
    </p>
  )
}
