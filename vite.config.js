import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    assetsInlineLimit: 0, // Don't inline any assets, keep them as separate files
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          // Keep image file names predictable
          if (/\.(jpg|jpeg|png|webp|svg|gif)$/.test(assetInfo.name)) {
            return 'assets/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        }
      }
    }
  }
})
