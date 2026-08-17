import { ChoiceButton, ChoiceGrid } from '../components/Field'
import { browsePath, childLabel, isIssue } from '../lib/hierarchy'
import { useAppData } from '../data/useAppData'

const bubbleRow = 'w-[calc(30em+1.5rem)] max-w-full'

export function Home() {
  const { hierarchy, extras } = useAppData()

  return (
    <div className="flex flex-col items-center gap-8">
      <section className="w-[20em] max-w-full rounded-xl bg-white px-4 py-3">
        <h1 className="font-display text-center text-lg font-bold tracking-tight text-ink">
          {hierarchy.title}
        </h1>
      </section>

      <div className={bubbleRow}>
        <ChoiceGrid>
          {hierarchy.children.map((child, index) => (
            <ChoiceButton
              key={isIssue(child) ? child.slug : `branch-${index}`}
              to={browsePath([index])}
              title={childLabel(child)}
            />
          ))}
        </ChoiceGrid>
      </div>

      {extras.length > 0 ? (
        <div className="mt-24 flex w-full flex-col items-center gap-8">
          <h2 className="font-display text-3xl font-bold tracking-tight text-ink">
            Other questions
          </h2>
          <div className={bubbleRow}>
            <ChoiceGrid>
              {extras.map((item) => (
                <ChoiceButton
                  key={item.slug}
                  to={`/info/${item.slug}`}
                  title={item.title}
                  variant="pink"
                />
              ))}
            </ChoiceGrid>
          </div>
        </div>
      ) : null}
    </div>
  )
}
