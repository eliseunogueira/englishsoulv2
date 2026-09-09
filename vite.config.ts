import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // <-- Adicione esta linha
const base = process.env.NODE_ENV === 'production'
    ? '/englishsoulv2/'
    : '/';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // <-- Adicione esta linha
  ],
  base,
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
})