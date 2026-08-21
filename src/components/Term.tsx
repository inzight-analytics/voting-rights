import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react'
import { Link } from 'react-router-dom'
import { useAppData } from '../data/useAppData'

const TERM_RE = /\[\[([^\]]+)\]\]/g
const CLOSE_DELAY_MS = 180
const VIEW_MARGIN = 8
const GAP = 8

export function Term({ termKey }: { termKey: string }) {
  const { extras } = useAppData()
  const item = extras.find((extra) => extra.key === termKey)
  const tipId = useId()
  const [open, setOpen] = useState(false)
  const [coords, setCoords] = useState<CSSProperties | null>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const rootRef = useRef<HTMLSpanElement>(null)
  const tipRef = useRef<HTMLSpanElement>(null)

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
      const width = Math.min(tipRect.width || 224, window.innerWidth - VIEW_MARGIN * 2)
      const height = tipRect.height

      let top = trigger.bottom + GAP
      if (top + height > window.innerHeight - VIEW_MARGIN && trigger.top - GAP - height >= VIEW_MARGIN) {
        top = trigger.top - GAP - height
      }

      let left = trigger.left + trigger.width / 2 - width / 2
      left = Math.min(Math.max(VIEW_MARGIN, left), window.innerWidth - VIEW_MARGIN - width)

      setCoords({
        position: 'fixed',
        top,
        left,
        width,
        transform: 'none',
      })
    }

    update()
    window.addEventListener('resize', update)
    window.addEventListener('scroll', update, true)
    return () => {
      window.removeEventListener('resize', update)
      window.removeEventListener('scroll', update, true)
    }
  }, [open, item?.summary, item?.key])

  if (!item) {
    return <span className="font-medium">{termKey}</span>
  }

  const show = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
    setOpen(true)
  }

  const hide = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    closeTimer.current = setTimeout(() => setOpen(false), CLOSE_DELAY_MS)
  }

  return (
    <span
      ref={rootRef}
      className="term relative inline"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) hide()
      }}
    >
      <button
        type="button"
        className="cursor-help border-0 bg-transparent p-0 font-[inherit] text-[length:inherit] leading-[inherit] text-inherit underline decoration-dotted decoration-ink/45 underline-offset-4"
        aria-describedby={open ? tipId : undefined}
      >
        {item.title}
      </button>
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
            {item.summary.trim() ? (
              <span className="block text-ink/80">{item.summary}</span>
            ) : (
              <span className="block text-ink/55">Open for the full explanation.</span>
            )}
            <Link
              to={`/info/${item.key}`}
              className="mt-2 inline-block font-semibold text-accent no-underline hover:underline"
              onClick={() => setOpen(false)}
            >
              Read more
            </Link>
          </span>
        </span>
      ) : null}
    </span>
  )
}

/** Split plain text on [[key]] markers and render Term nodes. */
export function withTerms(text: string): ReactNode {
  const parts: ReactNode[] = []
  let last = 0
  let match: RegExpExecArray | null
  const re = new RegExp(TERM_RE.source, 'g')

  while ((match = re.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index))
    parts.push(<Term key={`${match.index}-${match[1]}`} termKey={match[1]} />)
    last = match.index + match[0].length
  }

  if (last < text.length) parts.push(text.slice(last))
  if (parts.length === 0) return text
  if (parts.length === 1) return parts[0]
  return parts
}

/** Rewrite [[key]] to markdown links that Markdown renders as Term. */
export function rewriteTermMarkers(text: string): string {
  return text.replace(TERM_RE, (_full, key: string) => `[${key}](term:${key})`)
}
