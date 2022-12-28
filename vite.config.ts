import { defineConfig } from 'vitest/config'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
export default defineConfig({
  // TODO: fix deployability, now it is broken
  // base: "./",
  plugins: [svelte()],
  test: {
    includeSource: [
      "tests/**/*.{js,ts}"
    ]
  }
})
