import '@fontsource-variable/nunito'
import '../../registry/pouf/legacy.css'
import { useSyncExternalStore } from 'react'
import { createRoot } from 'react-dom/client'
import { allDemos } from '../../registry/pouf/demos'

function useHash() {
  return useSyncExternalStore(
    (cb) => { window.addEventListener('hashchange', cb); return () => window.removeEventListener('hashchange', cb) },
    () => window.location.hash,
  )
}

function App() {
  const hash = useHash() // '#/button/solid-md'
  const [, component, demoId] = hash.replace('#', '').split('/')
  const demo = component && demoId ? allDemos[component]?.find((d) => d.id === demoId) : undefined
  if (!demo) {
    return (
      <ul>
        {Object.entries(allDemos).flatMap(([c, ds]) =>
          ds.map((d) => (
            <li key={`${c}/${d.id}`}><a href={`#/${c}/${d.id}`}>{c}/{d.id}</a></li>
          )),
        )}
      </ul>
    )
  }
  return <main data-demo-root style={{ padding: 40 }}>{demo.render()}</main>
}

createRoot(document.getElementById('root')!).render(<App />)
