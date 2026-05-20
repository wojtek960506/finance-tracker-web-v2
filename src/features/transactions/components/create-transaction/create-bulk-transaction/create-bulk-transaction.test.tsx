import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createTestQueryClient } from '@test-utils/create-test-query-client';

import { CreateBulkTransaction } from './create-bulk-transaction';

const mocks = vi.hoisted(() => ({
  createExchangeTransaction: vi.fn(),
  createStandardTransaction: vi.fn(),
  createTransferTransaction: vi.fn(),
  location: { state: undefined as { returnTo: string } | undefined },
  navigate: vi.fn(),
  normalizeApiError: vi.fn(),
  pushToast: vi.fn(),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => mocks.navigate,
  useLocation: () => mocks.location,
}));

vi.mock('@transactions/api', () => ({
  createExchangeTransaction: (...args: unknown[]) =>
    mocks.createExchangeTransaction(...args),
  createStandardTransaction: (...args: unknown[]) =>
    mocks.createStandardTransaction(...args),
  createTransferTransaction: (...args: unknown[]) =>
    mocks.createTransferTransaction(...args),
}));

vi.mock('@shared/api/api-error', () => ({
  normalizeApiError: (error: unknown) => mocks.normalizeApiError(error),
}));

vi.mock('@store/toast-store', () => ({
  useToastStore: (selector: (state: { pushToast: typeof mocks.pushToast }) => unknown) =>
    selector({ pushToast: mocks.pushToast }),
}));

vi.mock('@shared/ui', async () => {
  const actual = await vi.importActual<typeof import('@shared/ui')>('@shared/ui');

  return {
    ...actual,
    DateInput: ({
      value,
      onChange,
      className,
    }: {
      value: string;
      onChange: (value: string) => void;
      className?: string;
    }) => (
      <input
        aria-label={className || 'date-input'}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    ),
  };
});

vi.mock('@transactions/components/shared', () => ({
  CurrencySelectField: ({
    value,
    onChange,
    placeholder,
  }: {
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
  }) => (
    <input
      aria-label={placeholder}
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  ),
  NamedResourceSelectField: ({
    value,
    onChange,
    placeholder,
  }: {
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
  }) => (
    <input
      aria-label={placeholder}
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  ),
  TransactionBackButton: ({ label, to }: { label: string; to: string }) => (
    <button type="button" data-to={to}>
      {label}
    </button>
  ),
}));

vi.mock('@/components/ui/number-input', () => ({
  NumberInput: ({
    value,
    onValueChange,
  }: {
    value: string;
    onValueChange: (value: string) => void;
  }) => (
    <input
      aria-label="number-input"
      value={value}
      onChange={(event) => onValueChange(event.target.value)}
    />
  ),
}));

vi.mock('@/components/ui/select', () => ({
  Select: ({
    value,
    onValueChange,
    children,
  }: {
    value?: string;
    onValueChange?: (value: string) => void;
    children: any;
  }) => {
    const items: Array<{ value: string; label: any }> = [];
    const trigger = Array.isArray(children)
      ? children.find(
          (child: any) => child?.type?.displayName === 'MockSelectTrigger',
        )
      : null;
    const content = Array.isArray(children)
      ? children.find(
          (child: any) => child?.type?.displayName === 'MockSelectContent',
        )
      : null;

    if (content?.props?.children) {
      const contentChildren = Array.isArray(content.props.children)
        ? content.props.children
        : [content.props.children];

      for (const child of contentChildren) {
        if (!child) continue;
        items.push({ value: child.props.value, label: child.props.children });
      }
    }

    return (
      <select
        aria-label={trigger?.props?.['aria-label']}
        value={value}
        onChange={(event) => onValueChange?.(event.target.value)}
      >
        <option value="">
          {trigger?.props?.children?.props?.['data-placeholder'] ??
            trigger?.props?.children?.props?.placeholder}
        </option>
        {items.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    );
  },
  SelectTrigger: Object.assign(
    ({
      children,
      'aria-label': ariaLabel,
    }: {
      children: any;
      'aria-label'?: string;
    }) => <mock-select-trigger aria-label={ariaLabel}>{children}</mock-select-trigger>,
    { displayName: 'MockSelectTrigger' },
  ),
  SelectValue: Object.assign(
    ({ placeholder }: { placeholder?: string }) => (
      <span data-placeholder={placeholder}>{placeholder}</span>
    ),
    { displayName: 'MockSelectValue' },
  ),
  SelectContent: Object.assign(
    ({ children }: { children: any }) => <mock-select-content>{children}</mock-select-content>,
    { displayName: 'MockSelectContent' },
  ),
  SelectItem: ({
    value,
    children,
  }: {
    value: string;
    children: any;
  }) => <option value={value}>{children}</option>,
}));

describe('CreateBulkTransaction', () => {
  beforeEach(() => {
    mocks.location.state = undefined;
    vi.clearAllMocks();
  });

  it('starts with one row, adds another row, and allows quick deletion', async () => {
    const user = userEvent.setup();
    const client = createTestQueryClient();

    render(
      <QueryClientProvider client={client}>
        <CreateBulkTransaction />
      </QueryClientProvider>,
    );

    expect(screen.getByText('bulkTransaction')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /delete-row-/ })).toHaveLength(1);

    await user.click(screen.getByRole('button', { name: 'addTransactionRow' }));

    expect(screen.getAllByRole('button', { name: /delete-row-/ })).toHaveLength(2);

    await user.click(screen.getByRole('button', { name: 'delete-row-2' }));

    expect(screen.getAllByRole('button', { name: /delete-row-/ })).toHaveLength(1);
  });

  it('creates a standard transaction from a bulk row and navigates back', async () => {
    const user = userEvent.setup();
    const client = createTestQueryClient();
    const invalidateQueriesSpy = vi.spyOn(client, 'invalidateQueries');
    const removeQueriesSpy = vi.spyOn(client, 'removeQueries');
    mocks.createStandardTransaction.mockResolvedValueOnce({ id: 'tx-1' });

    render(
      <QueryClientProvider client={client}>
        <CreateBulkTransaction />
      </QueryClientProvider>,
    );

    await user.selectOptions(screen.getByLabelText('transactionKind'), 'standard');
    await user.type(screen.getByRole('textbox', { name: 'description' }), 'Groceries');
    await user.type(screen.getByLabelText('number-input'), '10');
    await user.type(screen.getByLabelText('currencyPlaceholder'), 'USD');
    await user.click(screen.getByRole('button', { name: 'createTransactions' }));

    await waitFor(() =>
      expect(mocks.createStandardTransaction).toHaveBeenCalledWith({
        date: expect.any(String),
        description: 'Groceries',
        amount: 10,
        currency: 'USD',
        categoryId: undefined,
        paymentMethodId: undefined,
        accountId: undefined,
        transactionType: 'expense',
      }),
    );
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: ['transactions'] });
    expect(mocks.pushToast).toHaveBeenCalledWith({
      variant: 'success',
      title: 'transactionsCreated',
    });
    expect(removeQueriesSpy).toHaveBeenCalledWith({ queryKey: ['transactions'] });
    expect(removeQueriesSpy).toHaveBeenCalledWith({
      queryKey: ['transaction-totals'],
    });
    expect(mocks.navigate).toHaveBeenCalledWith('/transactions');
  });
});
