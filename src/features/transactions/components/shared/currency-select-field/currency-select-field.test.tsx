import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { createTestQueryClient } from '@test-utils/create-test-query-client';

import { CurrencySelectField } from './currency-select-field';

const mocks = vi.hoisted(() => ({
  getCurrencies: vi.fn(),
}));

vi.mock('@features/currencies/api', () => ({
  getCurrencies: (...args: unknown[]) => mocks.getCurrencies(...args),
}));

vi.mock('@/components/ui/combobox', () => ({
  Combobox: ({
    value,
    disabled,
    children,
  }: {
    value?: { code: string; name: string } | null;
    disabled?: boolean;
    children: React.ReactNode;
  }) => (
    <div>
      <span>value:{value?.code ?? 'unset'}</span>
      <span>{disabled ? 'disabled' : 'enabled'}</span>
      {children}
    </div>
  ),
  ComboboxInput: ({ placeholder }: { placeholder?: string }) => (
    <span>{placeholder}</span>
  ),
  ComboboxContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  ComboboxEmpty: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  ComboboxList: ({
    children,
  }: {
    children:
      | ((item: { code: string; name: string }) => React.ReactNode)
      | React.ReactNode;
  }) =>
    typeof children === 'function' ? (
      <div>{children({ code: 'USD', name: 'US Dollar' })}</div>
    ) : (
      <div>{children}</div>
    ),
  ComboboxItem: ({
    children,
    value,
    disabled,
  }: {
    children: React.ReactNode;
    value: { code: string; name: string };
    disabled?: boolean;
  }) => (
    <div>
      <span>item-value:{value.code}</span>
      <span>{disabled ? 'item-disabled' : 'item-enabled'}</span>
      {children}
    </div>
  ),
}));

const renderField = () => {
  const client = createTestQueryClient();

  render(
    <QueryClientProvider client={client}>
      <CurrencySelectField
        value=""
        onChange={() => {}}
        placeholder="Pick currency"
        searchPlaceholder="Search"
        emptyMessage="Empty"
      />
    </QueryClientProvider>,
  );
};

describe('CurrencySelectField', () => {
  it('renders loading state while currencies are being fetched', () => {
    mocks.getCurrencies.mockReturnValueOnce(new Promise(() => {}));

    renderField();

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.getByText('disabled')).toBeInTheDocument();
  });

  it('maps currencies to combobox items', async () => {
    mocks.getCurrencies.mockResolvedValueOnce([{ code: 'USD', name: 'US Dollar' }]);

    renderField();

    await waitFor(() => expect(screen.getByText('Search')).toBeInTheDocument());
    expect(screen.getByText('enabled')).toBeInTheDocument();
    expect(screen.getByText('item-value:USD')).toBeInTheDocument();
    expect(screen.getByText('item-enabled')).toBeInTheDocument();
    expect(screen.getByText('USD')).toBeInTheDocument();
    expect(screen.getByText('US Dollar')).toBeInTheDocument();
  });
});
