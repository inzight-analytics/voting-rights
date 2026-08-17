import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

export function Page({ children }: { children: ReactNode }) {
  return <div className="mx-auto max-w-2xl space-y-8">{children}</div>
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="text-sm font-semibold uppercase tracking-wide text-ink/50">{label}</h2>
      <div className="mt-2 text-[1.05rem] leading-relaxed">{children}</div>
    </section>
  )
}

export function ChoiceGrid({ children }: { children: ReactNode }) {
  return (
    <div className="grid w-full grid-cols-1 items-stretch gap-3 sm:grid-cols-2 sm:gap-6">
      {children}
    </div>
  )
}

export function ChoiceButton({
  to,
  title,
  hint,
  variant = 'peach',
  className = '',
}: {
  to: string
  title: string
  hint?: string
  variant?: 'peach' | 'pink'
  className?: string
}) {
  const surface =
    variant === 'pink' ? 'bg-pink hover:bg-rose' : 'bg-peach hover:bg-peach-deep'

  return (
    <Link
      to={to}
      className={`flex h-full flex-col items-center justify-center rounded-xl px-4 py-3 text-center text-ink no-underline transition ${surface} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${className}`}
    >
      <span className="font-semibold">{title}</span>
      {hint ? <span className="mt-1 text-sm font-normal text-ink/70">{hint}</span> : null}
    </Link>
  )
}
