import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createTestQueryClient } from '@test-utils/create-test-query-client';

import { NamedResourcesList } from './named-resources-list';

const createNamedResource = vi.fn();
const getNamedResources = vi.fn();
const normalizeApiError = vi.fn();
const pushToast = vi.fn();

vi.mock('react-i18next', () => ({
  useTranslation: (namespace: string) => ({
    t: (key: string) => `${namespace}:${key}`,
  }),
}));

vi.mock('@named-resources/api', () => ({
  NAMED_RESOURCE: {
    categories: 'category',
    paymentMethods: 'paymentMethod',
    accounts: 'account',
  },
  NAMED_RESOURCE_ERROR_NAMESPACE: {
    categories: 'category-errors',
    paymentMethods: 'payment-method-errors',
    accounts: 'account-errors',
  },
  createNamedResource: (...args: unknown[]) => createNamedResource(...args),
  getNamedResources: (...args: unknown[]) => getNamedResources(...args),
}));

vi.mock('@shared/api/api-error', () => ({
  normalizeApiError: (error: unknown) => normalizeApiError(error),
}));

vi.mock('@store/toast-store', () => ({
  useToastStore: (selector: (state: { pushToast: typeof pushToast }) => unknown) =>
    selector({ pushToast }),
}));

vi.mock('../named-resource-input', () => ({
  NamedResourceInput: ({
    action,
    inputRef,
    onError,
  }: {
    action: (name: string) => Promise<void>;
    inputRef: { current: HTMLInputElement | null };
    onError?: (error: unknown) => void;
  }) => (
    <div>
      <input
        aria-label="create named resource"
        ref={inputRef}
        defaultValue="Created name"
      />
      <button
        type="button"
        onClick={() =>
          action(inputRef.current?.value ?? 'Created name').catch((error) =>
            onError?.(error),
          )
        }
      >
        submit new named resource
      </button>
      <button
        type="button"
        onClick={() =>
          action(inputRef.current?.value ?? 'Created name').catch((error) => {
            inputRef.current = null;
            onError?.(error);
          })
        }
      >
        submit new named resource without ref
      </button>
    </div>
  ),
}));

vi.mock('./named-resource-preview', () => ({
  NamedResourcePreview: ({ namedResource }: { namedResource: { name: string } }) => (
    <li>{namedResource.name}</li>
  ),
}));

const renderList = () => {
  const client = createTestQueryClient();

  return {
    client,
    ...render(
      <QueryClientProvider client={client}>
        <NamedResourcesList kind="categories" />
      </QueryClientProvider>,
    ),
  };
};

describe('NamedResourcesList', () => {
  beforeEach(() => {
    createNamedResource.mockReset();
    getNamedResources.mockReset();
    normalizeApiError.mockReset();
    pushToast.mockReset();
  });

  it('renders loading state while fetching resources', () => {
    getNamedResources.mockImplementation(
      () =>
        new Promise(() => {
          return undefined;
        }),
    );

    renderList();

    expect(screen.getByText('Loading')).toBeInTheDocument();
  });

  it('renders query errors', async () => {
    getNamedResources.mockRejectedValueOnce(new Error('Fetch failed'));

    renderList();

    expect(await screen.findByText('Fetch failed')).toBeInTheDocument();
  });

  it('renders empty state when no resources are returned', async () => {
    getNamedResources.mockResolvedValueOnce([]);

    renderList();

    expect(
      await screen.findByText('There are no categories - TODO add button to create one'),
    ).toBeInTheDocument();
  });

  it('renders loaded resources', async () => {
    getNamedResources.mockResolvedValueOnce([
      {
        id: 'category-1',
        name: 'Groceries',
        ownerId: 'user-1',
        type: 'user',
        nameNormalized: 'groceries',
      },
    ]);

    renderList();

    expect(await screen.findByText('namedResources:newCategory')).toBeInTheDocument();
    expect(screen.getByText('Groceries')).toBeInTheDocument();
  });

  it('opens the create input and focuses it', async () => {
    const user = userEvent.setup();

    getNamedResources.mockResolvedValueOnce([
      {
        id: 'category-1',
        name: 'Groceries',
        ownerId: 'user-1',
        type: 'user',
        nameNormalized: 'groceries',
      },
    ]);

    renderList();

    await user.click(
      await screen.findByRole('button', { name: 'namedResources:newCategory' }),
    );

    expect(screen.getByLabelText('create named resource')).toHaveFocus();
    expect(
      screen.getByRole('button', { name: 'namedResources:newCategory' }),
    ).toBeDisabled();
  });

  it('creates a resource through the create input action', async () => {
    const user = userEvent.setup();

    getNamedResources.mockResolvedValue([
      {
        id: 'category-1',
        name: 'Groceries',
        ownerId: 'user-1',
        type: 'user',
        nameNormalized: 'groceries',
      },
    ]);
    createNamedResource.mockResolvedValueOnce({
      id: 'category-2',
      name: 'Created name',
      ownerId: 'user-1',
      type: 'user',
      nameNormalized: 'created name',
    });

    const { client } = renderList();
    const invalidateQueriesSpy = vi.spyOn(client, 'invalidateQueries');

    await user.click(
      await screen.findByRole('button', { name: 'namedResources:newCategory' }),
    );
    await user.click(screen.getByRole('button', { name: 'submit new named resource' }));

    await waitFor(() =>
      expect(createNamedResource).toHaveBeenCalledWith('categories', 'Created name'),
    );
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: ['categories'] });
    expect(pushToast).toHaveBeenCalledWith({
      variant: 'success',
      title: 'namedResources:resourceCreatedTitleCategory',
    });
  });

  it('shows an error toast when create fails', async () => {
    const user = userEvent.setup();
    const error = new Error('boom');

    getNamedResources.mockResolvedValueOnce([
      {
        id: 'category-1',
        name: 'Groceries',
        ownerId: 'user-1',
        type: 'user',
        nameNormalized: 'groceries',
      },
    ]);
    createNamedResource.mockRejectedValueOnce(error);
    normalizeApiError.mockReturnValue({
      code: 'CATEGORY_ALREADY_EXISTS',
      message: 'Already exists',
    });

    renderList();

    await user.click(
      await screen.findByRole('button', { name: 'namedResources:newCategory' }),
    );
    await user.click(screen.getByRole('button', { name: 'submit new named resource' }));

    await waitFor(() =>
      expect(pushToast).toHaveBeenCalledWith({
        variant: 'error',
        title: 'category-errors:CATEGORY_ALREADY_EXISTS',
      }),
    );
  });

  it('falls back to the api error message when create error code is missing', async () => {
    const user = userEvent.setup();
    const error = new Error('boom');

    getNamedResources.mockResolvedValueOnce([
      {
        id: 'category-1',
        name: 'Groceries',
        ownerId: 'user-1',
        type: 'user',
        nameNormalized: 'groceries',
      },
    ]);
    createNamedResource.mockRejectedValueOnce(error);
    normalizeApiError.mockReturnValue({
      message: 'Plain api error message',
    });

    renderList();

    await user.click(
      await screen.findByRole('button', { name: 'namedResources:newCategory' }),
    );
    await user.click(screen.getByRole('button', { name: 'submit new named resource' }));

    await waitFor(() =>
      expect(pushToast).toHaveBeenCalledWith({
        variant: 'error',
        title: 'namedResources:newCategory',
        message: 'Plain api error message',
      }),
    );
  });

  it('falls back to an empty resource name when the create input ref is unavailable', async () => {
    const user = userEvent.setup();
    const error = new Error('boom');

    getNamedResources.mockResolvedValueOnce([
      {
        id: 'category-1',
        name: 'Groceries',
        ownerId: 'user-1',
        type: 'user',
        nameNormalized: 'groceries',
      },
    ]);
    createNamedResource.mockRejectedValueOnce(error);
    normalizeApiError.mockReturnValue({
      code: 'CATEGORY_ALREADY_EXISTS',
      message: 'Already exists',
    });

    renderList();

    await user.click(
      await screen.findByRole('button', { name: 'namedResources:newCategory' }),
    );
    await user.click(
      screen.getByRole('button', {
        name: 'submit new named resource without ref',
      }),
    );

    await waitFor(() =>
      expect(pushToast).toHaveBeenCalledWith({
        variant: 'error',
        title: 'category-errors:CATEGORY_ALREADY_EXISTS',
      }),
    );
  });
});
