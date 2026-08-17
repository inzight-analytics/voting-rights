import { useEffect, useState } from 'react'
import type { ExtraItem, HierarchyNode, IssuesData } from '../types'
import { barrierNote, browsePath, childLabel, isBranch } from '../lib/hierarchy'
import { Breadcrumbs } from './Breadcrumbs'
import { ChoiceBubble, StickyNote } from './ChoiceCard'

type WizardProps = {
  node: HierarchyNode
  indices: number[]
  crumbs: Array<{ title: string; path: number[] }>
  extras?: ExtraItem[]
  issues: IssuesData
}

export function Wizard({ node, indices, crumbs, extras, issues }: WizardProps) {
  const [visible, setVisible] = useState(false)
  const pathKey = indices.join('/')

  useEffect(() => {
    setVisible(false)
    const id = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(id)
  }, [node.title, pathKey])

  const from = browsePath(indices)
  const showExtras = indices.length === 0 && extras && extras.length > 0
  const emptyBranch = node.children.length === 0
  const notes = node.children.map((child) => (isBranch(child) ? barrierNote(child, issues) : null))
  const isBarrierRow = notes.some(Boolean)

  return (
    <div
      key={pathKey}
      className={`mx-auto w-full text-center transition duration-500 ease-out ${
        visible ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-8 scale-[0.98] opacity-0'
      }`}
    >
      {indices.length > 0 ? (
        <div className="mb-8">
          <Breadcrumbs crumbs={crumbs} />
        </div>
      ) : null}

      <header className="mx-auto mb-10 max-w-3xl">
        <h1 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          {node.title}
        </h1>
        {node.description ? (
          <p className="mt-3 text-lg leading-relaxed text-ink/75">{node.description}</p>
        ) : null}
      </header>

      {emptyBranch ? (
        <p className="mx-auto mb-8 max-w-xl rounded-full bg-mint px-6 py-4 text-ink/80">
          This path is still being written. Please check back soon, or browse additional questions
          below.
        </p>
      ) : isBarrierRow ? (
        <div className="w-full overflow-x-auto [scrollbar-width:thin]">
          <ul className="mx-auto grid w-max grid-flow-col grid-rows-[minmax(7.5rem,auto)_auto_minmax(7.5rem,auto)] auto-cols-[9.35rem] gap-x-2.5 px-1">
            {node.children.map((child, index) => {
              const nextIndices = [...indices, index]
              const label = isBranch(child) ? childLabel(child) : (issues[child]?.title ?? child)
              const note = notes[index]
              const last = node.children.length - 1
              const noteAbove = index === 0 || index === last
              const to = isBranch(child)
                ? browsePath(nextIndices)
                : from === '/'
                  ? `/issue/${encodeURIComponent(child)}`
                  : `/issue/${encodeURIComponent(child)}?from=${encodeURIComponent(from)}`

              return (
                <li
                  key={isBranch(child) ? `branch-${index}` : child}
                  className="contents"
                >
                  <div className="flex items-end pb-1">
                    {note && noteAbove ? (
                      <StickyNote
                        text={note}
                        tone={index % 2 === 0 ? 'pink' : 'sticky'}
                        tilt="left"
                      />
                    ) : null}
                  </div>
                  <div className="flex items-center justify-center">
                    <ChoiceBubble to={to} label={label} size="sm" />
                  </div>
                  <div className="flex items-start pt-1">
                    {note && !noteAbove ? (
                      <StickyNote
                        text={note}
                        tone={index % 2 === 0 ? 'pink' : 'sticky'}
                        tilt="right"
                      />
                    ) : null}
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      ) : (
        <ul className="mx-auto flex w-full flex-wrap items-center justify-center gap-4 sm:gap-6">
          {node.children.map((child, index) => {
            const nextIndices = [...indices, index]
            const label = isBranch(child) ? childLabel(child) : (issues[child]?.title ?? child)
            const to = isBranch(child)
              ? browsePath(nextIndices)
              : from === '/'
                ? `/issue/${encodeURIComponent(child)}`
                : `/issue/${encodeURIComponent(child)}?from=${encodeURIComponent(from)}`

            return (
              <li key={isBranch(child) ? `branch-${index}` : child}>
                <ChoiceBubble to={to} label={label} />
              </li>
            )
          })}
        </ul>
      )}

      {showExtras ? (
        <section className="mt-14">
          <h2 className="mb-5 text-lg font-bold text-ink">Additional questions</h2>
          <ul className="flex flex-wrap items-center justify-center gap-3">
            {extras.map((item) => (
              <li key={item.slug}>
                <ChoiceBubble to={`/info/${item.slug}`} label={item.title} variant="pink" />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  )
}
