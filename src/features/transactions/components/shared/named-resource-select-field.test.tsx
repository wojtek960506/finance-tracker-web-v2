import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createTestQueryClient } from '@test-utils/create-test-query-client';

import { NamedResourceSelectField } from './named-resource-select-field';

const mocks = vi.hoisted(() => ({
  createNamedResource: vi.fn(),
  getNamedResources: vi.fn(),
  normalizeApiError: vi.fn(),
  pushToast: vi.fn(),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock('@named-resources/api', () => ({
  NAMED_RESOURCE: {
    categories: 'category',
    paymentMethods: 'paymentMethod',
    accounts: 'account',
  },
  createNamedResource: (...args: unknown[]) => mocks.createNamedResource(...args),
  getNamedResources: (...args: unknown[]) => mocks.getNamedResources(...args),
}));

vi.mock('@shared/api/api-error', () => ({
  normalizeApiError: (error: unknown) => mocks.normalizeApiError(error),
}));

vi.mock('@store/toast-store', () => ({
  useToastStore: (selector: (state: { pushToast: typeof mocks.pushToast }) => unknown) =>
    selector({ pushToast: mocks.pushToast }),
}));

vi.mock('@shared/ui', () => ({
  Button: ({
    children,
    disabled: _disabled,
    ...props
  }: React.ButtonHTMLAttributes<HTMLButtonElement>) => <button {...props}>{children}</button>,
  Input: (props: React.InputHTMLAttributes<HTMLInputElement>) => <input {...props} />,
  SearchableSelect: ({
    placeholder,
    disabled,
    groups,
    selectedOption,
    isOpen,
    onOpenChange,
    footer,
  }: {
    placeholder: string;
    disabled?: boolean;
    groups: Array<{
      key: string;
      label?: string;
      options: Array<{ value: string; label: string; searchText?: string }>;
    }>;
    selectedOption?: { label: string };
    isOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    footer?: React.ReactNode;
  }) => (
    <div>
      <span>{placeholder}</span>
      <span>{disabled ? 'disabled' : 'enabled'}</span>
      <span>{selectedOption?.label ?? 'no-selection'}</span>
      <button type="button" onClick={() => onOpenChange?.(true)}>
        open
      </button>
      <button type="button" onClick={() => onOpenChange?.(false)}>
        close
      </button>
      {groups.map((group) => (
        <div key={group.key}>
          {group.label && <p>{group.label}</p>}
          {group.options.map((option) => (
            <p key={option.value}>
              {option.label}:{option.searchText}
            </p>
          ))}
        </div>
      ))}
      {isOpen ? footer : null}
    </div>
  ),
}));

const renderField = (props?: Partial<React.ComponentProps<typeof NamedResourceSelectField>>) => {
  const client = createTestQueryClient();
  const onChange = vi.fn();

  render(
    <QueryClientProvider client={client}>
      <NamedResourceSelectField
        kind="categories"
        value=""
        onChange={onChange}
        placeholder="Pick resource"
        searchPlaceholder="Search"
        emptyMessage="Empty"
        showMoreLabel="showMore"
        showLessLabel="showLess"
        {...props}
      />
    </QueryClientProvider>,
  );

  return { client, onChange };
};

describe('NamedResourceSelectField', () => {
  beforeEach(() => {
    mocks.createNamedResource.mockReset();
    mocks.getNamedResources.mockReset();
    mocks.normalizeApiError.mockReset();
    mocks.pushToast.mockReset();
  });

  it('shows loading state while resources are loading', () => {
    mocks.getNamedResources.mockReturnValueOnce(new Promise(() => {}));

    renderField();

    expect(screen.getByText('loadingResources')).toBeInTheDocument();
    expect(screen.getByText('disabled')).toBeInTheDocument();
  });

  it('renders favorites, filters out system categories, and toggles the show more group', async () => {
    const user = userEvent.setup();
    mocks.getNamedResources.mockResolvedValueOnce([
      {
        id: 'cat-fav',
        name: 'Food',
        ownerId: 'user-1',
        type: 'user',
        nameNormalized: 'food',
        isFavorite: true,
      },
      {
        id: 'cat-other',
        name: 'Travel',
        ownerId: 'user-1',
        type: 'user',
        nameNormalized: 'travel',
        isFavorite: false,
      },
      {
        id: 'cat-system',
        name: 'exchange',
        ownerId: '',
        type: 'system',
        nameNormalized: 'exchange',
        isFavorite: false,
      },
    ]);

    renderField({ value: 'cat-fav' });

    await waitFor(() => expect(screen.getByText('Food')).toBeInTheDocument());
    expect(screen.getByText('Food')).toBeInTheDocument();
    expect(screen.queryByText('exchange:exchange exchange')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'open' }));
    expect(screen.getByText('favorites')).toBeInTheDocument();
    expect(screen.queryByText('allCategories')).not.toBeInTheDocument();
    expect(screen.queryByText('Travel:Travel')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'showMore' }));
    expect(screen.getByText('allCategories')).toBeInTheDocument();
    expect(screen.getByText('Travel:Travel')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'showLess' }));
    expect(screen.queryByText('allCategories')).not.toBeInTheDocument();
  });

  it('supports translated system resources and inline creation success', async () => {
    const user = userEvent.setup();
    mocks.getNamedResources.mockResolvedValueOnce([
      {
        id: 'pm-system',
        name: 'cash',
        ownerId: '',
        type: 'system',
        nameNormalized: 'cash',
        isFavorite: false,
      },
    ]);
    mocks.createNamedResource.mockResolvedValueOnce({
      id: 'pm-new',
      name: 'Wire',
      ownerId: 'user-1',
      type: 'user',
      nameNormalized: 'wire',
      isFavorite: false,
    });

    const { client, onChange } = renderField({
      kind: 'paymentMethods',
      value: 'pm-system',
    });

    await waitFor(() => expect(screen.getByText('cash')).toBeInTheDocument());

    await user.click(screen.getByRole('button', { name: 'open' }));
    await user.click(screen.getByRole('button', { name: 'newPaymentMethod' }));
    await user.type(screen.getByPlaceholderText('newPaymentMethod'), ' Wire ');
    await user.click(screen.getByRole('button', { name: 'confirmCreateInline' }));

    await waitFor(() =>
      expect(mocks.createNamedResource).toHaveBeenCalledWith('paymentMethods', 'Wire'),
    );
    expect(onChange).toHaveBeenCalledWith('pm-new');
    expect(client.getQueryData(['paymentMethods'])).toEqual([
      {
        id: 'pm-system',
        name: 'cash',
        ownerId: '',
        type: 'system',
        nameNormalized: 'cash',
        isFavorite: false,
      },
      {
        id: 'pm-new',
        name: 'Wire',
        ownerId: 'user-1',
        type: 'user',
        nameNormalized: 'wire',
        isFavorite: false,
      },
    ]);
    expect(mocks.pushToast).toHaveBeenCalledWith({
      variant: 'success',
      title: 'resourceCreatedTitlePaymentMethod',
    });
  });

  it('shows creation errors and resets inline state on cancel and close', async () => {
    const user = userEvent.setup();
    const error = new Error('boom');
    mocks.getNamedResources.mockResolvedValueOnce([]);
    mocks.createNamedResource.mockRejectedValueOnce(error);
    mocks.normalizeApiError.mockReturnValueOnce({ message: 'Already exists' });

    renderField();

    await waitFor(() => expect(screen.getByText('Pick resource')).toBeInTheDocument());
    await user.click(screen.getByRole('button', { name: 'open' }));
    await user.click(screen.getByRole('button', { name: 'newCategory' }));
    await user.type(screen.getByPlaceholderText('newCategory'), ' Duplicate ');
    await user.click(screen.getByRole('button', { name: 'confirmCreateInline' }));

    await waitFor(() =>
      expect(mocks.pushToast).toHaveBeenCalledWith({
        variant: 'error',
        title: 'Already exists',
      }),
    );

    await user.click(screen.getByRole('button', { name: 'cancelCreateInline' }));
    expect(screen.queryByPlaceholderText('newCategory')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'newCategory' }));
    await user.type(screen.getByPlaceholderText('newCategory'), 'Will reset');
    await user.click(screen.getByRole('button', { name: 'close' }));
    await user.click(screen.getByRole('button', { name: 'open' }));
    await user.click(screen.getByRole('button', { name: 'newCategory' }));
    expect(screen.getByPlaceholderText('newCategory')).toHaveValue('');
  });

  it('does not create a resource when the inline name is blank after trimming', async () => {
    const user = userEvent.setup();
    mocks.getNamedResources.mockResolvedValueOnce([]);

    renderField();

    await waitFor(() => expect(screen.getByText('Pick resource')).toBeInTheDocument());
    await user.click(screen.getByRole('button', { name: 'open' }));
    await user.click(screen.getByRole('button', { name: 'newCategory' }));
    await user.type(screen.getByPlaceholderText('newCategory'), '   ');
    await user.click(screen.getByRole('button', { name: 'confirmCreateInline' }));

    expect(mocks.createNamedResource).not.toHaveBeenCalled();
    expect(mocks.pushToast).not.toHaveBeenCalled();
  });
});
