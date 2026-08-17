import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

export function Page({ children }: { children: ReactNode }) {
  return <div className="space-y-8">{children}</div>
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="text-sm font-semibold uppercase tracking-wide text-ink/50">{label}</h2>
      <div className="mt-2 text-[1.05rem] leading-relaxed">{children}</div>
    </section>
  )
}

export function ChoiceButton({
  to,
  title,
  hint,
  variant = 'peach',
}: {
  to: string
  title: string
  hint?: string
  variant?: 'peach' | 'pink'
}) {
  const surface =
    variant === 'pink' ? 'bg-pink hover:bg-rose' : 'bg-peach hover:bg-peach-deep'

  return (
    <Link
      to={to}
      className={`block rounded-xl px-4 py-3 text-left text-ink no-underline transition ${surface} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent`}
    >
      <span className="block font-semibold">{title}</span>
      {hint ? <span className="mt-1 block text-sm font-normal text-ink/70">{hint}</span> : null}
    </Link>
  )
}
