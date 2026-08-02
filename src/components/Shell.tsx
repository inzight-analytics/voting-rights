import { Link, Outlet } from 'react-router-dom'
import type { ExtraItem } from '../types'

export function Shell({ extras }: { extras: ExtraItem[] }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-ink/10 bg-paper/80 backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-3xl items-baseline justify-between gap-4 px-4 py-5 sm:px-6">
          <Link to="/" className="font-display text-2xl font-semibold tracking-tight text-ink no-underline sm:text-3xl">
            Voting Rights
          </Link>
          <p className="hidden text-sm text-ink/55 sm:block">Enrolment &amp; voting guidance</p>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6">
        <Outlet />
      </main>

      <footer className="border-t border-ink/10 bg-white/40">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 py-8 sm:px-6">
          {extras.length > 0 ? (
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-ink/55">
                General information
              </h2>
              <ul className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-x-5">
                {extras.map((item) => (
                  <li key={item.slug}>
                    <Link
                      to={`/info/${item.slug}`}
                      className="text-accent no-underline hover:underline"
                    >
                      {item.issue.trim()}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          <p className="text-sm text-ink/50">
            Information for New Zealand enrolment and voting situations. Not affiliated with any
            political party.
          </p>
        </div>
      </footer>
    </div>
  )
}
