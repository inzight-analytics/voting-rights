import { Wizard } from '../components/Wizard'
import { useAppData } from '../data/useAppData'

export function Home() {
  const { hierarchy } = useAppData()
  return (
    <Wizard
      node={hierarchy}
      indices={[]}
      crumbs={[{ title: hierarchy.title, path: [] }]}
    />
  )
}
