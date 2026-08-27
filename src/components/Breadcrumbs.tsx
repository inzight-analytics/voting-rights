import { Link } from 'react-router-dom'
import { browsePath } from '../lib/hierarchy'

type Crumb = {
  title: string
  path: number[]
}

export function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-ink/70">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1
          return (
            <li key={browsePath(crumb.path)} className="flex items-center gap-2">
              {index > 0 ? <span aria-hidden>/</span> : null}
              {isLast ? (
                <span aria-current="page" className="font-medium text-ink/80">
                  {crumb.title}
                </span>
              ) : (
                <Link to={browsePath(crumb.path)} className="focus-ring">
                  {crumb.title}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
      <p className="mt-2">
        <Link to="/" className="focus-ring">
          Start over
        </Link>
      </p>
    </nav>
  )
}
