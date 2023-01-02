import { defineConfig } from 'vitest/config'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        svelte(),
        VitePWA({
            registerType: 'autoUpdate',
            manifest: {
                display: "fullscreen",
                background_color: "#FEC47F",
                theme_color: "#DD571C",
                icons: [
                    {
                        src: "icons/icon-512.png",
                        sizes: "512x512",
                        type: "image/png"
                    },
                    {
                        src: "icons/icon-192.png",
                        sizes: "192x192",
                        type: "image/png"
                    },
                    {
                        src: "icons/icon-32.png",
                        sizes: "32x32",
                        type: "image/png"
                    },
                    {
                        src: "icons/icon-16.png",
                        sizes: "16x16",
                        type: "image/png"
                    }
                ]
            }
        })
    ],
    test: {
        includeSource: [
            "tests/**/*.{js,ts}"
        ]
    }
})
