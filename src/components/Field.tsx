import type { ReactNode, Ref } from 'react'
import { useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
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
      <h2 className="text-sm font-semibold uppercase tracking-wide text-ink/50">{label}</h2>
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
      className={`post-it pointer-events-none rounded-[2px] px-3 py-2 text-left text-sm leading-snug text-ink/80 ${surface} ${className}`}
    >
      <span className="relative z-10">
        {typeof children === 'string' ? withTerms(children) : children}
      </span>
    </p>
  )
}

const TIP_CLOSE_MS = 180
const TIP_MARGIN = 8
const TIP_GAP = 8

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
  const tipId = useId()
  const [open, setOpen] = useState(false)
  const [coords, setCoords] = useState<CSSProperties | null>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const tipRef = useRef<HTMLSpanElement>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const surface = variant === 'pink' ? 'bg-pink/35' : 'bg-peach/35'

  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current)
    }
  }, [])

  useLayoutEffect(() => {
    if (!open) {
      setCoords(null)
      return
    }

    const root = rootRef.current
    const tip = tipRef.current
    if (!root || !tip) return

    const update = () => {
      const trigger = root.getBoundingClientRect()
      const tipRect = tip.getBoundingClientRect()
      const width = Math.min(tipRect.width || 224, window.innerWidth - TIP_MARGIN * 2)
      const height = tipRect.height

      let top = trigger.bottom + TIP_GAP
      if (top + height > window.innerHeight - TIP_MARGIN && trigger.top - TIP_GAP - height >= TIP_MARGIN) {
        top = trigger.top - TIP_GAP - height
      }

      let left = trigger.left + trigger.width / 2 - width / 2
      left = Math.min(Math.max(TIP_MARGIN, left), window.innerWidth - TIP_MARGIN - width)

      setCoords({ position: 'fixed', top, left, width, transform: 'none' })
    }

    update()
    window.addEventListener('resize', update)
    window.addEventListener('scroll', update, true)
    return () => {
      window.removeEventListener('resize', update)
      window.removeEventListener('scroll', update, true)
    }
  }, [open, message])

  const show = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
    setOpen(true)
  }

  const hide = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    closeTimer.current = setTimeout(() => setOpen(false), TIP_CLOSE_MS)
  }

  return (
    <div
      ref={rootRef}
      className="relative h-full"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) hide()
      }}
    >
      <div
        role="button"
        aria-disabled="true"
        aria-describedby={open ? tipId : undefined}
        tabIndex={0}
        className={`flex h-full cursor-default flex-col items-center rounded-xl px-4 text-center text-ink/40 ${surface} ${className}`}
      >
        <span className="font-semibold">{withTerms(title)}</span>
      </div>
      {open ? (
        <span
          ref={tipRef}
          id={tipId}
          role="tooltip"
          style={coords ?? { visibility: 'hidden' }}
          className="fixed z-30 w-56 max-w-[calc(100vw-1rem)]"
          onMouseEnter={show}
          onMouseLeave={hide}
        >
          <span className="block rounded-lg bg-white px-3 py-2 text-left text-sm font-normal leading-snug text-ink shadow-[0_8px_24px_rgb(60_51_41/0.18)]">
            {message}
          </span>
        </span>
      ) : null}
    </div>
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
}: {
  to: string
  title: string
  hint?: string
  variant?: 'peach' | 'pink'
  className?: string
  disabled?: boolean
  disabledTooltip?: string
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
      className={`flex h-full flex-col items-center rounded-xl px-4 text-center text-ink no-underline transition ${surface} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${className}`}
    >
      <span className="font-semibold">{withTerms(title)}</span>
      {hint ? <span className="mt-1 text-sm font-normal text-ink/70">{withTerms(hint)}</span> : null}
    </Link>
  )
}
