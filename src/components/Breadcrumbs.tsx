import { Link } from 'react-router-dom'
import { browsePath } from '../lib/hierarchy'

type Crumb = {
  title: string
  path: number[]
}

export function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-ink/65">
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1
          return (
            <li key={browsePath(crumb.path)} className="flex items-center gap-2">
              {index > 0 ? <span aria-hidden>/</span> : null}
              {isLast ? (
                <span className="font-medium text-ink/85">{crumb.title}</span>
              ) : (
                <Link
                  to={browsePath(crumb.path)}
                  className="text-accent no-underline hover:underline"
                >
                  {crumb.title}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
      <div className="mt-3">
        <Link to="/" className="text-sm font-medium text-accent no-underline hover:underline">
          Start over
        </Link>
      </div>
    </nav>
  )
}
