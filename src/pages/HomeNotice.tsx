import { useSearchParams } from 'react-router-dom'
import { Home } from './Home'

const MESSAGES: Record<string, string> = {
  invalid: 'That path was not found. Start again from the options below.',
  'unknown-issue': 'That situation was not found. Choose from the options below.',
  'unknown-info': 'That information page was not found.',
}

export function HomeNotice() {
  const [params] = useSearchParams()
  const notice = params.get('notice')
  const message = notice ? MESSAGES[notice] : null

  return (
    <>
      {message ? (
        <div
          role="status"
          className="mb-6 rounded-2xl bg-mint px-4 py-3 text-sm text-ink/80"
        >
          {message}
        </div>
      ) : null}
      <Home />
    </>
  )
}
