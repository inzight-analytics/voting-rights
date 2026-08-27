import type { Components } from 'react-markdown'
import ReactMarkdown, { defaultUrlTransform } from 'react-markdown'
import { parseSourceItem } from '../lib/answer'
import { ExternalLink } from './a11y'
import { rewriteTermMarkers, Term, withTerms } from './Term'

const markdownComponents: Components = {
  a({ href, children }) {
    if (href?.startsWith('term:')) {
      return <Term termKey={decodeURIComponent(href.slice('term:'.length))} />
    }
    return <ExternalLink href={href ?? '#'}>{children}</ExternalLink>
  },
}

function urlTransform(url: string): string {
  if (url.startsWith('term:')) return url
  return defaultUrlTransform(url)
}

export function Markdown({ content }: { content: string }) {
  return (
    <div className="prose-content">
      <ReactMarkdown components={markdownComponents} urlTransform={urlTransform}>
        {rewriteTermMarkers(content)}
      </ReactMarkdown>
    </div>
  )
}

/** Plain (non-markdown) copy that still expands [[key]] terms. */
export function RichText({ content }: { content: string }) {
  return <>{withTerms(content)}</>
}

export function Source({ source }: { source: string[] }) {
  const items = source.map((item) => item.trim()).filter(Boolean)
  if (!items.length) return null

  return (
    <ul className="m-0 flex list-none flex-col gap-1 p-0">
      {items.map((item, index) => {
        const { href, label, note } = parseSourceItem(item)
        return (
          <li key={`${index}-${item}`} className="m-0">
            {href ? (
              <ExternalLink href={href}>{label}</ExternalLink>
            ) : (
              <RichText content={label} />
            )}
            {note ? ` (${note})` : null}
          </li>
        )
      })}
    </ul>
  )
}
