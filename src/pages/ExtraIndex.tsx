import { ChoiceButton, Field, Page } from '../components/Field'
import { useAppData } from '../data/useAppData'

export function ExtraIndex() {
  const { extras } = useAppData()

  return (
    <Page>
      <h1 className="font-display text-3xl font-bold tracking-tight text-ink">Other questions</h1>
      <Field label="Topics">
        {extras.length === 0 ? (
          <p className="text-ink/70">No extra topics yet.</p>
        ) : (
          <ul className="space-y-3">
            {extras.map((item) => (
              <li key={item.key}>
                <ChoiceButton to={`/info/${item.key}`} title={item.title} variant="pink" />
              </li>
            ))}
          </ul>
        )}
      </Field>
    </Page>
  )
}
