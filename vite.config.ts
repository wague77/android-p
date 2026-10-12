import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// legacy() : code compatible avec les anciens navigateurs Android (WebView Chrome 49+).
export default defineConfig({
  plugins: [react(), legacy({ targets: ['android >= 5', 'chrome >= 49'] })],
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
