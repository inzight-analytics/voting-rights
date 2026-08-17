import { Link } from 'react-router-dom'

type ChoiceBubbleProps = {
  to: string
  label: string
  variant?: 'peach' | 'pink'
  size?: 'md' | 'sm'
}

export function ChoiceBubble({
  to,
  label,
  variant = 'peach',
  size = 'md',
}: ChoiceBubbleProps) {
  const surface =
    variant === 'pink' ? 'bg-pink hover:bg-rose/80' : 'bg-peach hover:bg-peach-deep/80'
  const sizing =
    size === 'sm'
      ? 'w-full px-3 py-3 text-[0.8rem] leading-snug sm:text-[0.85rem]'
      : 'max-w-[17rem] px-6 py-4 text-base leading-snug sm:text-lg'

  return (
    <Link
      to={to}
      className={`relative z-10 inline-flex items-center justify-center rounded-full text-center font-semibold text-ink no-underline shadow-sm transition duration-200 ${surface} ${sizing} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent`}
    >
      {label}
    </Link>
  )
}

type StickyNoteProps = {
  text: string
  tone: 'pink' | 'sticky'
  tilt?: 'left' | 'right'
}

export function StickyNote({ text, tone, tilt = 'left' }: StickyNoteProps) {
  return (
    <span
      className={`block w-full rounded-xs px-2.5 py-2.5 text-left text-[11px] font-medium leading-snug text-ink/85 shadow-[2px_3px_6px_rgba(60,51,41,0.16)] ${
        tone === 'pink' ? 'bg-pink' : 'bg-sticky'
      } ${tilt === 'left' ? '-rotate-2 origin-bottom' : 'rotate-[1.5deg] origin-top'}`}
    >
      {text}
    </span>
  )
}
