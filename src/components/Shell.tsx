import { useLayoutEffect, useRef } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { ExternalLink } from './a11y'
import { HistoryNav, parentPath } from './HistoryNav'

export function Shell() {
  const { pathname } = useLocation()
  const showHistory = pathname !== '/'
  const mainRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const main = mainRef.current
    if (main) {
      main.focus({ preventScroll: true })
    }

    const h1 = document.querySelector('main h1')
    document.title = h1?.textContent?.trim()
      ? `${h1.textContent.trim()} — Voting Rights`
      : 'Voting Rights'
  }, [pathname])

  return (
    <div className="relative flex min-h-dvh flex-col bg-paper">
      <a href="#main-content" className="skip-link focus-ring">
        Skip to main content
      </a>

      <header className="shrink-0">
        <div className="mx-auto w-full max-w-[100rem] px-4 py-5 sm:px-8">
          <Link
            to="/"
            aria-current={pathname === '/' ? 'page' : undefined}
            className="focus-ring font-display text-2xl font-bold tracking-tight text-ink no-underline sm:text-3xl"
          >
            Voting Rights
          </Link>
        </div>
      </header>

      {showHistory ? (
        <div className="mx-auto w-full max-w-[100rem] px-4 sm:px-8">
          <HistoryNav fallback={parentPath(pathname)} />
        </div>
      ) : null}

      <main
        id="main-content"
        ref={mainRef}
        tabIndex={-1}
        className="mx-auto flex w-full max-w-[100rem] flex-1 flex-col px-4 py-8 sm:px-8"
      >
        <Outlet />
      </main>

      <footer className="shrink-0">
        <div className="mx-auto max-w-2xl px-4 py-8 text-center text-sm text-ink/70 sm:px-8">
          <p>
            Funded and created by{' '}
            <ExternalLink
              href="https://www.royalsociety.org.nz/what-we-do/funds-and-opportunities/rutherford-discovery-fellowships/rutherford-discovery-fellowship-recipients/lara-greaves"
              className="text-accent"
            >
              Lara Greaves&rsquo; Rutherford Discovery Fellowship
            </ExternalLink>{' '}
            from the Royal Society Te Apārangi.
          </p>
          <p className="mt-2">
            Supported by{' '}
            <ExternalLink href="https://inzight.co.nz" className="text-accent">
              iNZight Analytics
            </ExternalLink>
          </p>
          <p className="mt-2 text-ink/70">
            Information for New Zealand enrolment and voting situations. Not affiliated with any
            political party.
          </p>
        </div>
      </footer>
    </div>
  )
}
