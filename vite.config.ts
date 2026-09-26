import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
// `base` is set for GitHub Pages project-site hosting at
// https://<user>.github.io/bloom/. Override with the BASE_PATH env var
// (e.g. BASE_PATH=/ for local root serving or a custom domain).
export default defineConfig({
  base: process.env.BASE_PATH ?? '/bloom/',
  plugins: [react()],
})
