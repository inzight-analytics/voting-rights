import ReactMarkdown from 'react-markdown'
import { sourceHref } from '../lib/answer'

export function Markdown({ content }: { content: string }) {
  return (
    <div className="prose-content">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  )
}

export function Source({ source }: { source: string[] }) {
  const items = source.map((item) => item.trim()).filter(Boolean)
  if (!items.length) return null

  return (
    <ul className="m-0 flex list-none flex-col gap-1 p-0">
      {items.map((item, index) => {
        const href = sourceHref(item)
        return (
          <li key={`${index}-${item}`} className="m-0">
            {href ? (
              <a href={href} target="_blank" rel="noopener noreferrer">
                {item}
              </a>
            ) : (
              item
            )}
          </li>
        )
      })}
    </ul>
  )
}
