import { Link } from 'react-router-dom'

type ChoiceCardProps = {
  to: string
  label: string
  hint?: string
}

export function ChoiceCard({ to, label, hint }: ChoiceCardProps) {
  return (
    <Link
      to={to}
      className="group flex items-center justify-between gap-4 border-l-4 border-transparent bg-white/70 px-4 py-4 no-underline shadow-sm transition duration-200 hover:border-accent hover:bg-white focus-visible:border-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:px-5"
    >
      <span className="min-w-0">
        <span className="block font-medium text-ink transition group-hover:text-accent">
          {label}
        </span>
        {hint ? (
          <span className="mt-1 block text-sm text-ink/60">{hint}</span>
        ) : null}
      </span>
      <span
        aria-hidden
        className="shrink-0 text-accent transition group-hover:translate-x-0.5"
      >
        →
      </span>
    </Link>
  )
}
