/**
 * Fetch the sheet and rebuild JSON only when the CSV export changed.
 */
import { execSync } from 'node:child_process'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { fetchSheetCsv, rootDir, sheetCsvPath } from './sheet-export.ts'

const previous = existsSync(sheetCsvPath) ? readFileSync(sheetCsvPath, 'utf8') : null
const text = await fetchSheetCsv()

if (previous === text) {
  console.log('Sheet unchanged — skipping build:data.')
  process.exit(0)
}

writeFileSync(sheetCsvPath, text)
console.log(`Wrote data/sheet.csv (${text.split('\n').length} lines)`)

execSync('npm run build:data', { cwd: rootDir, stdio: 'inherit' })
