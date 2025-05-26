import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    react({
      fastRefresh: true,
      include: "**/*.{jsx,tsx}",
    }),
  ],
  server: {
    hmr: {
      overlay: true, // Show HMR errors as overlay
    },
    watch: {
      usePolling: false, // Better performance on Windows
      interval: 100, // Check for changes every 100ms
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
      '/health': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      }
    },
  },
  optimizeDeps: {
    include: ['lucide-react', 'react', 'react-dom'],
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
    },
    dynamicImportVarsOptions: {
      warnOnError: true,
    },
  },
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
  },
});
