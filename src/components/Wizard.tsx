import { useLayoutEffect, useRef, useState } from 'react'
import type { HierarchyNode, TreeNode } from '../types'
import { browsePath, childLabel, firstIssueQuestion, isBranch, isIssue } from '../lib/hierarchy'
import { Breadcrumbs } from './Breadcrumbs'
import { ChoiceButton, ChoiceGrid, ChoiceWrap, Field, HeadingBubble, LevelCanvas, Page, PostIt } from './Field'
import { IssueAdvice } from './IssueView'

function useFirstRowCount(itemCount: number) {
  const ref = useRef<HTMLDivElement>(null)
  const [count, setCount] = useState(0)

  useLayoutEffect(() => {
    const root = ref.current
    if (!root) return

    const update = () => {
      const items = [...root.children] as HTMLElement[]
      if (items.length === 0) {
        setCount(0)
        return
      }
      const top = Math.min(...items.map((el) => el.offsetTop))
      setCount(items.filter((el) => Math.abs(el.offsetTop - top) < 2).length)
    }

    update()
    const observer = new ResizeObserver(update)
    observer.observe(root)
    return () => observer.disconnect()
  }, [itemCount])

  return { ref, count }
}

type WizardProps = {
  node: TreeNode
  indices: number[]
  crumbs: Array<{ title: string; path: number[] }>
}

function Barriers({ node, indices }: { node: HierarchyNode; indices: number[] }) {
  const { ref: wrapRef, count: firstRowCount } = useFirstRowCount(node.children.length)

  return (
    <LevelCanvas
      header={
        <>
          <HeadingBubble>{node.title}</HeadingBubble>
          {node.description ? (
            <p className="max-w-2xl text-center font-bold">{node.description}</p>
          ) : null}
        </>
      }
    >
      {node.children.length === 0 ? (
        <p className="text-ink/70">This path is still being written.</p>
      ) : (
        <ChoiceWrap ref={wrapRef}>
          {node.children.map((child, index) => {
            const example = firstIssueQuestion(child)
            const noteShift = index % 2 === 0 ? '-left-2' : '-right-2'
            const firstRow = index < firstRowCount
            return (
              <div
                key={isIssue(child) ? child.slug : `branch-${index}`}
                className="group relative h-full"
                data-first-row={firstRow ? '' : undefined}
              >
                <ChoiceButton
                  to={browsePath([...indices, index])}
                  title={childLabel(child)}
                  className="justify-center py-8"
                />
                {example ? (
                  <PostIt
                    className={`absolute top-full z-10 w-[calc(100%-1.25rem)] -translate-y-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100 group-data-first-row:top-auto group-data-first-row:bottom-full group-data-first-row:translate-y-3 ${noteShift}`}
                    variant={index % 2 === 0 ? 'pink' : 'yellow'}
                  >
                    {example}
                  </PostIt>
                ) : null}
              </div>
            )
          })}
        </ChoiceWrap>
      )}
    </LevelCanvas>
  )
}

function BarrierIssues({ node, indices }: { node: HierarchyNode; indices: number[] }) {
  return (
    <LevelCanvas
      header={
        <>
          <p className="text-center font-bold">What&rsquo;s the issue?</p>
          <HeadingBubble>{node.title}</HeadingBubble>
        </>
      }
    >
      {node.children.length === 0 ? (
        <p className="text-ink/70">This path is still being written.</p>
      ) : (
        <ChoiceWrap>
          {node.children.map((child, index) => (
            <ChoiceButton
              key={isIssue(child) ? child.slug : `branch-${index}`}
              to={browsePath([...indices, index])}
              title={childLabel(child)}
              className="justify-center py-8"
            />
          ))}
        </ChoiceWrap>
      )}
    </LevelCanvas>
  )
}

export function Wizard({ node, indices, crumbs }: WizardProps) {
  if (indices.length === 1 && isBranch(node)) {
    return <Barriers node={node} indices={indices} />
  }

  if (indices.length === 2 && isBranch(node)) {
    return <BarrierIssues node={node} indices={indices} />
  }

  if (isIssue(node)) {
    return <IssueAdvice issue={node} />
  }

  return (
    <Page>
      {indices.length > 0 ? <Breadcrumbs crumbs={crumbs} /> : null}

      <h1 className="font-display text-3xl font-bold tracking-tight text-ink">{node.title}</h1>

      {node.description ? (
        <Field label="Description">
          <p>{node.description}</p>
        </Field>
      ) : null}

      <Field label="Children">
        {node.children.length === 0 ? (
          <p className="text-ink/70">This path is still being written.</p>
        ) : (
          <ChoiceGrid>
            {node.children.map((child, index) => {
              const nextIndices = [...indices, index]
              const hint = isBranch(child)
                ? child.description || undefined
                : child.question && child.question !== child.title
                  ? child.question
                  : undefined

              return (
                <ChoiceButton
                  key={isIssue(child) ? child.slug : `branch-${index}`}
                  to={browsePath(nextIndices)}
                  title={childLabel(child)}
                  hint={hint}
                />
              )
            })}
          </ChoiceGrid>
        )}
      </Field>
    </Page>
  )
}
