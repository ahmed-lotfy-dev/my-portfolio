import { defineConfig } from 'vitest/config'

import path from "node:path"

import { playwright } from '@vitest/browser-playwright'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "happy-dom",
    globals: true,
    setupFiles: path.resolve(__dirname, "./vitest.setup.ts"),
    browser: {
      enabled: false,
      provider: playwright(),
      instances: [
        { browser: 'chromium' },
      ],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})