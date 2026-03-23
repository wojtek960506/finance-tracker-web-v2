import '@shared/i18n';

import { QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import type { ReactElement } from 'react';
import { BrowserRouter } from 'react-router-dom';

import { ThemeProvider } from '@context/theme-context';

import { createTestQueryClient } from './create-test-query-client';

export const renderWithProviders = (ui: ReactElement) => {
  const queryClient = createTestQueryClient();

  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider>{ui}</ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>,
  );
};
