import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true 
      },
      manifest: {
        name: 'Truck Expense Tracker',
        short_name: 'TruckApp',
        description: 'Track trips and expenses for trucking business',
        theme_color: '#000000',
        background_color: '#ffffff',
        display: 'standalone',
        // SVG kadhun aapan aaple local PNGs takle
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
})