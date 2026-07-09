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
  DEFAULT_EXPORT_FILENAME: 'transactions-export.csv',
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
    const csv = new Blob(['date,amount']);
    const user = userEvent.setup();
    const createObjectUrlSpy = vi.fn(() => 'blob:transactions-export');
    const revokeObjectUrlSpy = vi.fn();
    let createdAnchor: HTMLAnchorElement | null = null;
    Object.defineProperty(window.URL, 'createObjectURL', {
      configurable: true,
      value: createObjectUrlSpy,
    });
    Object.defineProperty(window.URL, 'revokeObjectURL', {
      configurable: true,
      value: revokeObjectUrlSpy,
    });
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined);
    const createElementSpy = vi.spyOn(document, 'createElement');
    createElementSpy.mockImplementation((tagName: string) => {
      const element = document.createElementNS('http://www.w3.org/1999/xhtml', tagName);

      if (tagName === 'a') createdAnchor = element as HTMLAnchorElement;

      return element;
    });

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
    await user.clear(screen.getByRole('textbox'));
    await user.type(screen.getByRole('textbox'), 'monthly-summary');
    await user.click(screen.getByRole('button', { name: 'exportTransactionsSubmit' }));

    expect(mocks.exportTransactions).toHaveBeenCalledWith({
      startDate: '2024-01-01',
      transactionType: 'expense',
    });
    expect(createObjectUrlSpy).toHaveBeenCalledWith(csv);
    expect(clickSpy).toHaveBeenCalled();
    expect(createdAnchor).not.toBeNull();
    expect(createdAnchor!.download).toMatch(
      /^monthly-summary_\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2}\.csv$/,
    );
    expect(revokeObjectUrlSpy).toHaveBeenCalledWith('blob:transactions-export');
    expect(mocks.pushToast).toHaveBeenCalledWith({
      variant: 'success',
      title: 'transactionsExported',
    });
  });

  it('shows an inline error and does not export when file base is empty', async () => {
    const user = userEvent.setup();

    const client = new QueryClient({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    });

    render(
      <QueryClientProvider client={client}>
        <ExportTransactionsButton filters={{}} />
      </QueryClientProvider>,
    );

    await user.click(screen.getByRole('button', { name: 'exportTransactions' }));
    await user.clear(screen.getByRole('textbox'));
    await user.click(screen.getByRole('button', { name: 'exportTransactionsSubmit' }));

    expect(mocks.exportTransactions).not.toHaveBeenCalled();
    expect(screen.getByText('exportFileNameRequired')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });
});
