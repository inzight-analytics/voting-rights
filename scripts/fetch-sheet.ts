/**
 * Download the "tidied again" Google Sheet tab over data/sheet.csv.
 *
 * https://docs.google.com/spreadsheets/d/1CxW5cp2BycDtSWLwWlQc221Ndey0Hdx9IKHO2ZSZ3I8/edit?gid=260816713
 */
import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const SHEET_ID = '1CxW5cp2BycDtSWLwWlQc221Ndey0Hdx9IKHO2ZSZ3I8'
const GID = '260816713'
const EXPORT_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${GID}`

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '..')
const outPath = join(rootDir, 'data', 'sheet.csv')

const res = await fetch(EXPORT_URL, {
  headers: { 'user-agent': 'voting-rights-data-fetch' },
})
if (!res.ok) {
  throw new Error(`Sheet export failed: ${res.status} ${res.statusText}`)
}

const text = (await res.text()).replace(/\r\n/g, '\n').replace(/\r/g, '\n')
if (!text.startsWith('TOP LEVEL,')) {
  throw new Error('Unexpected sheet export — check the tab is public and gid=260816713')
}

writeFileSync(outPath, text)
console.log(`Wrote data/sheet.csv (${text.split('\n').length} lines)`)
