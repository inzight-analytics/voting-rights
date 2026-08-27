import type { ReactNode, Ref } from 'react'
import { Link } from 'react-router-dom'
import { withTerms } from './Term'

export function LevelCanvas({ header, children }: { header: ReactNode; children: ReactNode }) {
  return (
    <div className="flex w-full flex-1 flex-col items-center justify-center gap-20">
      <div className="flex flex-col items-center gap-8">{header}</div>
      {children}
    </div>
  )
}

export function Page({ children }: { children: ReactNode }) {
  return <div className="mx-auto max-w-2xl space-y-8">{children}</div>
}

export function HeadingBubble({ children }: { children: ReactNode }) {
  return (
    <section className="w-[20em] max-w-full rounded-xl bg-white px-4 py-3">
      <h1 className="font-display text-center text-lg font-bold tracking-tight text-ink">
        {typeof children === 'string' ? withTerms(children) : children}
      </h1>
    </section>
  )
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="text-sm font-semibold uppercase tracking-wide text-ink">{label}</h2>
      <div className="mt-2 text-[1.05rem] leading-relaxed">{children}</div>
    </section>
  )
}

export function ChoiceGrid({ children }: { children: ReactNode }) {
  return (
    <div className="grid w-full grid-cols-2 items-stretch gap-3 sm:gap-6">
      {children}
    </div>
  )
}

export function ChoiceWrap({
  children,
  ref,
}: {
  children: ReactNode
  ref?: Ref<HTMLDivElement>
}) {
  return (
    <div
      ref={ref}
      className="grid w-full auto-rows-[1fr] grid-cols-2 justify-center gap-x-3 gap-y-6 overflow-visible sm:grid-cols-[repeat(auto-fit,minmax(min(100%,15em),15em))] sm:gap-x-6 sm:gap-y-8"
    >
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
      aria-hidden="true"
      className={`post-it pointer-events-none rounded-[2px] px-3 py-2 text-left text-sm leading-snug text-ink/80 ${surface} ${className}`}
    >
      <span className="relative z-10">{children}</span>
    </p>
  )
}

function ComingSoonChoice({
  title,
  variant,
  className,
  message,
}: {
  title: string
  variant: 'peach' | 'pink'
  className: string
  message: string
}) {
  const surface = variant === 'pink' ? 'bg-pink/35' : 'bg-peach/35'

  return (
    <button
      type="button"
      aria-disabled="true"
      className={`focus-ring flex h-full min-h-11 cursor-default flex-col items-center rounded-xl px-4 py-3 text-center text-ink/70 ${surface} ${className}`}
      onClick={(event) => event.preventDefault()}
    >
      <span className="font-semibold">{withTerms(title)}</span>
      <span className="sr-only">{message}</span>
    </button>
  )
}

export function ChoiceButton({
  to,
  title,
  hint,
  variant = 'peach',
  className = 'justify-center py-3',
  disabled = false,
  disabledTooltip = 'This is still being prepared, check back soon!',
  describedBy,
}: {
  to: string
  title: string
  hint?: string
  variant?: 'peach' | 'pink'
  className?: string
  disabled?: boolean
  disabledTooltip?: string
  describedBy?: string
}) {
  if (disabled) {
    return (
      <ComingSoonChoice
        title={title}
        variant={variant}
        className={className}
        message={disabledTooltip}
      />
    )
  }

  const surface =
    variant === 'pink' ? 'bg-pink hover:bg-rose' : 'bg-peach hover:bg-peach-deep'

  return (
    <Link
      to={to}
      aria-describedby={describedBy}
      className={`focus-ring flex h-full min-h-11 flex-col items-center rounded-xl px-4 py-3 text-center text-ink no-underline transition ${surface} ${className}`}
    >
      <span className="font-semibold">{withTerms(title)}</span>
      {hint ? <span className="mt-1 text-sm font-normal text-ink/70">{withTerms(hint)}</span> : null}
    </Link>
  )
}
