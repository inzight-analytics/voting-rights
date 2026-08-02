import { useEffect, useState } from 'react'
import type { HierarchyNode } from '../types'
import { browsePath, childLabel, isBranch } from '../lib/hierarchy'
import { Breadcrumbs } from './Breadcrumbs'
import { ChoiceCard } from './ChoiceCard'

type WizardProps = {
  node: HierarchyNode
  indices: number[]
  crumbs: Array<{ title: string; path: number[] }>
}

export function Wizard({ node, indices, crumbs }: WizardProps) {
  const [visible, setVisible] = useState(false)
  const pathKey = indices.join('/')

  useEffect(() => {
    setVisible(false)
    const id = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(id)
  }, [node.title, pathKey])

  const from = browsePath(indices)

  return (
    <div
      className={`transition duration-300 ease-out ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
      }`}
    >
      {indices.length > 0 ? <Breadcrumbs crumbs={crumbs} /> : null}

      <header className="mb-8 max-w-2xl">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          {node.title}
        </h1>
        {node.description ? (
          <p className="mt-3 text-lg leading-relaxed text-ink/70">{node.description}</p>
        ) : null}
      </header>

      <ul className="flex max-w-2xl flex-col gap-2">
        {node.children.map((child, index) => {
          const nextIndices = [...indices, index]
          const label = childLabel(child)

          if (isBranch(child)) {
            return (
              <li key={`branch-${index}`}>
                <ChoiceCard
                  to={browsePath(nextIndices)}
                  label={label}
                  hint={child.description}
                />
              </li>
            )
          }

          const issuePath = `/issue/${encodeURIComponent(child)}`
          const to = from === '/' ? issuePath : `${issuePath}?from=${encodeURIComponent(from)}`

          return (
            <li key={`leaf-${index}`}>
              <ChoiceCard to={to} label={label} />
            </li>
          )
        })}
      </ul>
    </div>
  )
}
