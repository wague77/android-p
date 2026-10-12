import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import legacy from '@vitejs/plugin-legacy';

// Pour Vercel on met '/', pour Capacitor on met './'
const isCapacitor = process.env.BUILD_TARGET === 'capacitor';

export default defineConfig({
  plugins: [react(), legacy({ targets: ['android >= 5', 'chrome >= 49'] })],
  base: isCapacitor ? './' : '/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
