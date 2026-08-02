import ReactMarkdown from 'react-markdown'

export function Markdown({ content }: { content: string }) {
  return (
    <div className="prose-content">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  )
}
