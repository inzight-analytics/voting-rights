import { Link, Outlet } from 'react-router-dom'

export function Shell() {
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

      <main className="mx-auto w-full max-w-[100rem] flex-1 px-4 py-8 sm:px-8">
        <Outlet />
      </main>

      <footer className="shrink-0">
        <div className="mx-auto max-w-2xl px-4 py-8 text-center text-sm text-ink/55 sm:px-8">
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
          <p className="mt-2 text-ink/45">
            Information for New Zealand enrolment and voting situations. Not affiliated with any
            political party.
          </p>
        </div>
      </footer>
    </div>
  )
}
