import tsConfigPaths from 'vite-tsconfig-paths';
import { defineConfig, mergeConfig } from 'vitest/config';

import viteConfig from './vite.config';

export default mergeConfig(
  viteConfig,
  defineConfig({
    plugins: [tsConfigPaths()],
    test: {
      globals: true,
      environment: 'jsdom',
      includeSource: ['src/**/*.{ts,tsx}'],
      include: ['src/**/*.test.{ts,tsx}', 'src/**/*.spec.{ts,tsx}'],
      setupFiles: './src/setupTests.ts',
      coverage: {
        provider: 'v8',
        reporter: ['text', 'html', 'json-summary', 'lcov'],
        reportsDirectory: './coverage',
        include: ['src/**/*.{ts,tsx}'],
        exclude: [
          'src/**/*.test.{ts,tsx}',
          'src/**/*.spec.{ts,tsx}',
          'src/**/index.ts',
          'src/**/*types*.ts',
          'src/**/test-utils/*',
        ],
      },
    },
  }),
);
