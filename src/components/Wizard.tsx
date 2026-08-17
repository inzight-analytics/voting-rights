import { Link } from 'react-router-dom'
import type { TreeNode } from '../types'
import { browsePath, childLabel, isBranch, isIssue } from '../lib/hierarchy'
import { Breadcrumbs } from './Breadcrumbs'
import { ChoiceButton, ChoiceGrid, Field, Page } from './Field'
import { IssueFields } from './IssueView'

type WizardProps = {
  node: TreeNode
  indices: number[]
  crumbs: Array<{ title: string; path: number[] }>
}

export function Wizard({ node, indices, crumbs }: WizardProps) {
  return (
    <Page>
      {indices.length > 0 ? <Breadcrumbs crumbs={crumbs} /> : null}

      <h1 className="font-display text-3xl font-bold tracking-tight text-ink">{node.title}</h1>

      {isIssue(node) ? (
        <IssueFields issue={node} />
      ) : (
        <>
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
        </>
      )}

      {indices.length > 0 ? (
        <p>
          <Link to={browsePath(indices.slice(0, -1))}>← Back</Link>
        </p>
      ) : null}
    </Page>
  )
}
