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
    // Port is read from the PORT env var (set by Claude preview MCP /
    // any process manager); falls back to Vite's default 5173 otherwise.
    // No hardcode here so autoPort in .claude/launch.json works.
    open: false,
  },
  preview: {
    port: 4173,
  },
});
