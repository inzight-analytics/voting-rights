import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin, type PreviewServer, type ViteDevServer } from 'vite'

const ALIASES: Record<string, string> = { issues: 'hierarchy' }

function jsonApi(): Plugin {
  const dataDir = () => join(process.cwd(), 'src', 'data')

  function fileFor(name: string): string | null {
    const mapped = ALIASES[name] ?? name
    if (!/^[a-z0-9-]+$/.test(mapped)) return null
    const file = join(dataDir(), `${mapped}.json`)
    return existsSync(file) ? file : null
  }

  function attach(server: ViteDevServer | PreviewServer) {
    server.middlewares.use((req, res, next) => {
      if (req.method && req.method !== 'GET' && req.method !== 'HEAD') {
        next()
        return
      }

      const path =
        (req.url ?? '')
          .split('?')[0]
          ?.replace(/^\/voting-rights/, '')
          .replace(/\/$/, '') || '/'
      const match = /^\/api\/([a-z0-9-]+)$/.exec(path)
      if (!match) {
        next()
        return
      }

      const file = fileFor(match[1])
      res.setHeader('Content-Type', 'application/json; charset=utf-8')
      if (!file) {
        res.statusCode = 404
        res.end(JSON.stringify({ error: `Unknown API resource: ${match[1]}` }))
        return
      }

      const body = readFileSync(file)
      if (req.method === 'HEAD') {
        res.end()
        return
      }
      res.end(body)
    })
  }

  return {
    name: 'json-api',
    configureServer: attach,
    configurePreviewServer: attach,
  }
}

// Project Pages: https://inzight-analytics.github.io/voting-rights/
export default defineConfig({
  base: '/voting-rights/',
  plugins: [react(), tailwindcss(), jsonApi()],
})
