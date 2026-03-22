import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
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
    },
  },
});
