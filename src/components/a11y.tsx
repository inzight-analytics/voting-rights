import type { ReactNode } from 'react'

export function OpensInNewTab() {
  return <span className="sr-only"> (opens in new tab)</span>
}

export function ExternalLink({
  href,
  children,
  className,
}: {
  href: string
  children: ReactNode
  className?: string
}) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
      <OpensInNewTab />
    </a>
  )
}
