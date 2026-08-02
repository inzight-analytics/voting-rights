import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Project Pages: https://inzight-analytics.github.io/voting-rights/
export default defineConfig({
  base: '/voting-rights/',
  plugins: [react(), tailwindcss()],
})
