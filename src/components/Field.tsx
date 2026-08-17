import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

export function Page({ children }: { children: ReactNode }) {
  return <div className="mx-auto max-w-2xl space-y-8">{children}</div>
}

export function HeadingBubble({ children }: { children: ReactNode }) {
  return (
    <section className="w-[20em] max-w-full rounded-xl bg-white px-4 py-3">
      <h1 className="font-display text-center text-lg font-bold tracking-tight text-ink">
        {children}
      </h1>
    </section>
  )
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

export function ChoiceWrap({ children }: { children: ReactNode }) {
  return (
    <div className="grid w-full auto-rows-[1fr] grid-cols-[repeat(auto-fit,minmax(min(100%,15em),15em))] justify-center gap-x-3 gap-y-44 overflow-visible sm:gap-x-6 sm:gap-y-52">
      {children}
    </div>
  )
}

export function PostIt({
  children,
  className = '',
  variant = 'yellow',
}: {
  children: ReactNode
  className?: string
  variant?: 'yellow' | 'pink'
}) {
  const surface = variant === 'pink' ? 'bg-pink' : 'bg-sticky'

  return (
    <p
      className={`pointer-events-none rounded-xl px-3 py-2 text-center text-xs leading-snug text-ink/80 shadow-[0_2px_8px_rgb(60_51_41_/0.12)] ${surface} ${className}`}
    >
      {children}
    </p>
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
