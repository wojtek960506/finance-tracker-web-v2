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

vi.mock('@shared/ui', () => ({
  SearchableSelect: ({
    placeholder,
    disabled,
    groups,
  }: {
    placeholder: string;
    disabled?: boolean;
    groups: Array<{ key: string; options: Array<{ label: string; hint?: string }> }>;
  }) => (
    <div>
      <span>{placeholder}</span>
      <span>{disabled ? 'disabled' : 'enabled'}</span>
      {groups.map((group) => (
        <div key={group.key}>
          {group.options.map((option) => (
            <div key={option.label}>
              {option.label}:{option.hint}
            </div>
          ))}
        </div>
      ))}
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

  it('maps currencies to searchable select groups', async () => {
    mocks.getCurrencies.mockResolvedValueOnce([{ code: 'USD', name: 'US Dollar' }]);

    renderField();

    await waitFor(() => expect(screen.getByText('Pick currency')).toBeInTheDocument());
    expect(screen.getByText('enabled')).toBeInTheDocument();
    expect(screen.getByText('USD:US Dollar')).toBeInTheDocument();
  });
});
