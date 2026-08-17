import { Link, Outlet } from 'react-router-dom'
import type { ExtraItem } from '../types'

export function Shell({ extras }: { extras: ExtraItem[] }) {
  return (
    <div className="flex min-h-dvh flex-col bg-paper">
      <header className="shrink-0">
        <div className="mx-auto flex w-full max-w-[100rem] items-baseline justify-between gap-4 px-4 py-5 sm:px-8">
          <Link
            to="/"
            className="font-display text-2xl font-bold tracking-tight text-ink no-underline sm:text-3xl"
          >
            Voting Rights
          </Link>
          <p className="hidden text-sm font-medium text-ink/60 sm:block">
            Enrolment &amp; voting guidance
          </p>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-[100rem] flex-1 flex-col justify-center px-4 py-8 sm:px-8">
        <Outlet />
      </main>

      <footer className="shrink-0">
        <div className="mx-auto flex w-full max-w-[100rem] flex-col items-center gap-5 px-4 py-8 text-center sm:px-8">
          {extras.length > 0 ? (
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wide text-ink/55">
                Additional questions
              </h2>
              <ul className="mt-3 flex flex-wrap justify-center gap-2">
                {extras.map((item) => (
                  <li key={item.slug}>
                    <Link
                      to={`/info/${item.slug}`}
                      className="inline-block rounded-full bg-pink px-3 py-1.5 text-sm font-semibold text-ink no-underline hover:bg-rose"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          <div className="max-w-2xl space-y-2 text-sm text-ink/55">
            <p>
              Funded and created by{' '}
              <a
                href="https://www.royalsociety.org.nz/what-we-do/funds-and-opportunities/rutherford-discovery-fellowships/rutherford-discovery-fellowship-recipients/lara-greaves"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent"
              >
                Lara Greaves&rsquo; Rutherford Discovery Fellowship
              </a>{' '}
              from the Royal Society Te Apārangi.
            </p>
            <p className="text-ink/45">
              Information for New Zealand enrolment and voting situations. Not affiliated with any
              political party.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
