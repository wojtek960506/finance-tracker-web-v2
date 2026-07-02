import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ExportTransactionsButton } from './export-transactions';

const mocks = vi.hoisted(() => ({
  exportTransactions: vi.fn(),
  pushToast: vi.fn(),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock('@transactions/api', () => ({
  exportTransactions: (...args: unknown[]) => mocks.exportTransactions(...args),
}));

vi.mock('@shared/api/api-error', () => ({
  normalizeApiError: (error: unknown) =>
    error instanceof Error ? error : new Error('Unexpected error'),
}));

vi.mock('@store/toast-store', () => ({
  useToastStore: (selector: (state: { pushToast: typeof mocks.pushToast }) => unknown) =>
    selector({ pushToast: mocks.pushToast }),
}));

describe('ExportTransactionsButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('downloads the exported csv for the active filters', async () => {
    const user = userEvent.setup();
    const csv = new Blob(['date,amount']);
    const createObjectUrlSpy = vi.fn(() => 'blob:transactions-export');
    const revokeObjectUrlSpy = vi.fn();
    Object.defineProperty(window.URL, 'createObjectURL', {
      configurable: true,
      value: createObjectUrlSpy,
    });
    Object.defineProperty(window.URL, 'revokeObjectURL', {
      configurable: true,
      value: revokeObjectUrlSpy,
    });
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined);

    mocks.exportTransactions.mockResolvedValueOnce({
      csv,
      fileName: 'transactions-backup.csv',
    });

    const client = new QueryClient({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    });

    render(
      <QueryClientProvider client={client}>
        <ExportTransactionsButton
          filters={{
            startDate: '2024-01-01',
            transactionType: 'expense',
          }}
        />
      </QueryClientProvider>,
    );

    await user.click(screen.getByRole('button', { name: 'exportTransactions' }));

    expect(mocks.exportTransactions).toHaveBeenCalledWith({
      startDate: '2024-01-01',
      transactionType: 'expense',
    });
    expect(createObjectUrlSpy).toHaveBeenCalledWith(csv);
    expect(clickSpy).toHaveBeenCalled();
    expect(revokeObjectUrlSpy).toHaveBeenCalledWith('blob:transactions-export');
    expect(mocks.pushToast).toHaveBeenCalledWith({
      variant: 'success',
      title: 'transactionsExported',
    });
  });
});
