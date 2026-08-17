import { copyFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

/** GitHub Pages serves this for unknown paths so deep links load the SPA. */
function spaFallback(): Plugin {
  return {
    name: 'spa-fallback',
    closeBundle() {
      const index = join(process.cwd(), 'dist', 'index.html')
      if (existsSync(index)) copyFileSync(index, join(process.cwd(), 'dist', '404.html'))
    },
  }
}

// Project Pages: https://inzight-analytics.github.io/voting-rights/
export default defineConfig({
  base: '/voting-rights/',
  plugins: [react(), tailwindcss(), spaFallback()],
})
