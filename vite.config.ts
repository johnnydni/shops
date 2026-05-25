import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Custom domain (ritmopadel.shop) → base = '/'. If you ever deploy to
// user.github.io/<repo> drop the base to '/shops/' or whatever.
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    sourcemap: true,
    target: 'es2020',
  },
  server: {
    port: 5173,
    open: false,
  },
  preview: {
    port: 4173,
  },
});
