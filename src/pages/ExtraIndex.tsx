import { ChoiceButton, Field, Page } from '../components/Field'
import { useAppData } from '../data/useAppData'

export function ExtraIndex() {
  const { extras } = useAppData()

  return (
    <Page>
      <h1 className="font-display text-3xl font-bold tracking-tight text-ink">Other questions</h1>
      <Field label="Children">
        {extras.length === 0 ? (
          <p className="text-ink/70">No extra topics yet.</p>
        ) : (
          <ul className="space-y-3">
            {extras.map((item) => (
              <li key={item.slug}>
                <ChoiceButton to={`/info/${item.slug}`} title={item.title} variant="pink" />
              </li>
            ))}
          </ul>
        )}
      </Field>
    </Page>
  )
}
