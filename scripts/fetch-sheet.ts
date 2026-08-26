import { writeFileSync } from 'node:fs'
import { fetchSheetCsv, sheetCsvPath } from './sheet-export.ts'

const text = await fetchSheetCsv()
writeFileSync(sheetCsvPath, text)
console.log(`Wrote data/sheet.csv (${text.split('\n').length} lines)`)
