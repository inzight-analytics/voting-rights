#!/usr/bin/env node
import { AxePuppeteer } from '@axe-core/puppeteer'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { createServer } from 'node:http'
import { join, extname } from 'node:path'
import { fileURLToPath } from 'node:url'
import puppeteer from 'puppeteer-core'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const root = join(__dirname, '..')
const dist = join(root, 'dist')
const port = 4173

if (!existsSync(join(dist, 'index.html'))) {
  console.error('Missing dist/index.html — run npm run build first.')
  process.exit(1)
}

const chromePath = process.env.CHROME_PATH ?? '/usr/bin/chromium'
if (!existsSync(chromePath)) {
  console.error(`Chromium not found at ${chromePath}. Set CHROME_PATH to your browser executable.`)
  process.exit(1)
}

const ROUTES = [
  '/',
  '/0',
  '/0/0',
  '/issue/i-have-to-bring-my-kids-with-me',
  '/info',
]

const MIME = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
}

function serveDist() {
  return createServer((req, res) => {
    const url = new URL(req.url ?? '/', `http://localhost:${port}`)
    let path = join(dist, decodeURIComponent(url.pathname))
    if (url.pathname.endsWith('/')) path = join(path, 'index.html')
    if (!extname(path)) path = join(dist, 'index.html')

    if (!existsSync(path)) {
      path = join(dist, 'index.html')
    }

    const body = readFileSync(path)
    const ext = extname(path)
    res.writeHead(200, { 'Content-Type': MIME[ext] ?? 'application/octet-stream' })
    res.end(body)
  })
}

const server = serveDist()
await new Promise((resolve) => server.listen(port, resolve))

const browser = await puppeteer.launch({
  executablePath: chromePath,
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
})

const report = { scannedAt: new Date().toISOString(), routes: [], violations: [] }

try {
  const page = await browser.newPage()

  for (const route of ROUTES) {
    const url = `http://localhost:${port}${route}`
    console.log(`Scanning ${url}…`)
    await page.goto(url, { waitUntil: 'networkidle0' })
    const results = await new AxePuppeteer(page).analyze()
    report.routes.push({ route, url, violations: results.violations.length })
    if (results.violations.length) {
      report.violations.push({ route, items: results.violations })
    }
  }

  writeFileSync(join(root, 'a11y-report.json'), JSON.stringify(report, null, 2))
  console.log('Report written to a11y-report.json')

  const total = report.violations.reduce((n, v) => n + v.items.length, 0)
  if (total > 0) {
    console.error(`Found ${total} violation group(s) across ${report.violations.length} route(s).`)
    for (const entry of report.violations) {
      for (const item of entry.items) {
        console.error(`  ${entry.route}: ${item.id} — ${item.help}`)
      }
    }
    process.exit(1)
  }
  console.log('No axe violations found.')
} finally {
  await browser.close()
  server.close()
}
