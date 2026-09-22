import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

const usePolling = process.env.CHOKIDAR_USEPOLLING === '1';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    watch: {
      ignored: ['**/coverage/**', '**/dist/**', '**/.prettierignore/**'],
      usePolling,
      interval: usePolling ? 1000 : undefined,
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (!id.includes('node_modules')) return;

          // Normalize pnpm and standard node_modules paths to package name
          const pnpmMatch = id.match(
            /node_modules\/\.pnpm\/([^/]+)\/node_modules\/((?:@[^/]+\/)?[^/]+)/,
          );
          const stdMatch = id.match(/node_modules\/((?:@[^/]+\/)?[^/]+)/);
          const pkg = pnpmMatch ? pnpmMatch[2] : stdMatch ? stdMatch[1] : '';

          if (
            pkg === 'react' ||
            pkg === 'react-dom' ||
            pkg === 'scheduler' ||
            pkg === 'react-router' ||
            pkg === 'react-router-dom'
          ) {
            return 'vendor-react';
          }
          if (pkg.startsWith('@tanstack/') || pkg === 'axios' || pkg === 'zustand') {
            return 'vendor-query';
          }
          if (
            pkg === 'radix-ui' ||
            pkg.startsWith('@radix-ui/') ||
            pkg.startsWith('@base-ui/') ||
            pkg === 'lucide-react' ||
            pkg === 'clsx' ||
            pkg === 'tailwind-merge' ||
            pkg === 'class-variance-authority' ||
            pkg === 'react-day-picker' ||
            pkg === 'react-focus-lock' ||
            pkg === 'react-flagkit'
          ) {
            return 'vendor-ui';
          }
          if (
            pkg === 'i18next' ||
            pkg === 'react-i18next' ||
            pkg === 'i18next-browser-languagedetector'
          ) {
            return 'vendor-i18n';
          }
          if (
            pkg === 'zod' ||
            pkg === 'react-hook-form' ||
            pkg.startsWith('@hookform/')
          ) {
            return 'vendor-forms';
          }
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@app': path.resolve(__dirname, './src/app'),
      '@features': path.resolve(__dirname, './src/features'),
      '@ui': path.resolve(__dirname, './src/shared/ui'),
      '@store': path.resolve(__dirname, './src/shared/store'),
      '@context': path.resolve(__dirname, './src/shared/context'),
      '@shared': path.resolve(__dirname, './src/shared'),
      '@auth': path.resolve(__dirname, './src/features/auth'),
      '@transactions': path.resolve(__dirname, './src/features/transactions'),
      '@investments': path.resolve(__dirname, './src/features/investments'),
      '@net-worth': path.resolve(__dirname, './src/features/net-worth'),
      '@test-utils': path.resolve(__dirname, './src/test-utils'),
      '@named-resources': path.resolve(__dirname, './src/features/named-resources'),
    },
  },
});
