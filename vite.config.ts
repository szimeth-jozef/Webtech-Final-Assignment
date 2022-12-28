import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
export default defineConfig({
  // TODO: fix deployability, now it is broken
  // base: "./",
  plugins: [svelte()],
})
