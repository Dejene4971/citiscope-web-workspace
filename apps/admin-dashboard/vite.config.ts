import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@citiscope/types':   path.resolve(__dirname, '../../packages/types/src'),
      '@citiscope/ui':      path.resolve(__dirname, '../../packages/ui/src'),
      '@citiscope/charts':  path.resolve(__dirname, '../../packages/charts/src'),
      '@citiscope/store':   path.resolve(__dirname, '../../packages/store/src'),
      '@citiscope/hooks':   path.resolve(__dirname, '../../packages/hooks/src'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
});