import ReactMarkdown from 'react-markdown'
import { sourceHref } from '../lib/answer'

export function Markdown({ content }: { content: string }) {
  return (
    <div className="prose-content">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  )
}

export function Source({ source }: { source: string }) {
  if (!source.trim()) return null
  const href = sourceHref(source)

  return (
    <p className="m-0">
      {href ? (
        <a href={href} target="_blank" rel="noopener noreferrer">
          {source}
        </a>
      ) : (
        source
      )}
    </p>
  )
}
