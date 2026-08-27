import { useNavigate } from 'react-router-dom'

function canGoBack() {
  const idx = window.history.state?.idx
  return typeof idx === 'number' ? idx > 0 : window.history.length > 1
}

const control =
  'focus-ring bg-transparent p-0 font-inherit text-sm font-medium no-underline hover:underline'

export function HistoryNav({ fallback }: { fallback: string }) {
  const navigate = useNavigate()

  return (
    <nav aria-label="Back">
      <button
        type="button"
        aria-label="Back to previous page"
        className={`${control} text-accent`}
        onClick={() => (canGoBack() ? navigate(-1) : navigate(fallback))}
      >
        ← Back
      </button>
    </nav>
  )
}

export function parentPath(pathname: string): string {
  const parts = pathname.split('/').filter(Boolean)
  if (parts.length === 0) return '/'
  return `/${parts.slice(0, -1).join('/')}`
}
