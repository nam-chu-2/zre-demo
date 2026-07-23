/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // Served from https://nam-chu-2.github.io/zre-demo/
  base: '/zre-demo/',
  plugins: [react(), tailwindcss()],
  test: {
    include: ['src/**/*.test.ts'],
    environment: 'node',
  },
})
