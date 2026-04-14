import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { NamedResourceType } from '@named-resources/api';
import { createTestQueryClient } from '@test-utils/create-test-query-client';

import { NamedResourcePreview } from './named-resource-preview';

const pushToast = vi.fn();
const deleteNamedResource = vi.fn();
const favoriteNamedResource = vi.fn();
const updateNamedResource = vi.fn();
const unfavoriteNamedResource = vi.fn();
const normalizeApiError = vi.fn();

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
  deleteNamedResource: (...args: unknown[]) => deleteNamedResource(...args),
  favoriteNamedResource: (...args: unknown[]) => favoriteNamedResource(...args),
  updateNamedResource: (...args: unknown[]) => updateNamedResource(...args),
  unfavoriteNamedResource: (...args: unknown[]) => unfavoriteNamedResource(...args),
}));

vi.mock('@shared/api/api-error', () => ({
  normalizeApiError: (error: unknown) => normalizeApiError(error),
}));

vi.mock('@store/toast-store', () => ({
  useToastStore: (selector: (state: { pushToast: typeof pushToast }) => unknown) =>
    selector({ pushToast }),
}));

vi.mock('@named-resources/components/named-resource-input', () => ({
  NamedResourceInput: ({
    action,
    initialValue,
    inputRef,
    onError,
  }: {
    action: (name: string) => Promise<void>;
    initialValue: string;
    inputRef: { current: HTMLInputElement | null };
    onError?: (error: unknown) => void;
  }) => (
    <div>
      <input
        aria-label="edit named resource"
        defaultValue={initialValue}
        ref={inputRef}
      />
      <button
        type="button"
        onClick={() =>
          action(inputRef.current?.value ?? initialValue).catch((error) =>
            onError?.(error),
          )
        }
      >
        save named resource
      </button>
      <button
        type="button"
        onClick={() =>
          action(inputRef.current?.value ?? initialValue).catch((error) => {
            inputRef.current = null;
            onError?.(error);
          })
        }
      >
        save named resource without ref
      </button>
    </div>
  ),
}));

const userResource = {
  id: 'category-1',
  name: 'Groceries',
  ownerId: 'user-1',
  type: 'user' as NamedResourceType,
  nameNormalized: 'groceries',
  isFavorite: false,
};

const renderPreview = (namedResource = userResource) => {
  const client = createTestQueryClient();

  return {
    client,
    ...render(
      <QueryClientProvider client={client}>
        <NamedResourcePreview kind="categories" namedResource={namedResource} />
      </QueryClientProvider>,
    ),
  };
};

describe('NamedResourcePreview', () => {
  beforeEach(() => {
    pushToast.mockReset();
    deleteNamedResource.mockReset();
    favoriteNamedResource.mockReset();
    updateNamedResource.mockReset();
    normalizeApiError.mockReset();
    unfavoriteNamedResource.mockReset();
  });

  it('renders translated system resources as locked', () => {
    const { container } = renderPreview({
      ...userResource,
      name: 'salary',
      type: 'system',
    });

    expect(screen.getByText('namedResources:salary')).toBeInTheDocument();
    expect(screen.queryByText('Groceries')).not.toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(container.querySelector('svg.lucide-lock')).toBeInTheDocument();
  });

  it('favorites a resource and invalidates named resources query', async () => {
    const user = userEvent.setup();
    favoriteNamedResource.mockResolvedValueOnce({ ...userResource, isFavorite: true });
    const { client } = renderPreview();
    const favoriteButton = screen.getByRole('button', {
      name: 'namedResources:favoriteNamedResource',
    });
    const invalidateQueriesSpy = vi.spyOn(client, 'invalidateQueries');

    await user.click(favoriteButton);

    expect(favoriteNamedResource).toHaveBeenCalledWith('categories', 'category-1');
    await waitFor(() =>
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: ['categories'] }),
    );
  });

  it('unfavorites a resource and invalidates named resources query', async () => {
    const user = userEvent.setup();
    unfavoriteNamedResource.mockResolvedValueOnce({
      acknowledged: true,
      deletedCount: 1,
    });
    const { client } = renderPreview({ ...userResource, isFavorite: true });
    const favoriteButton = screen.getByRole('button', {
      name: 'namedResources:unfavoriteNamedResource',
    });
    const invalidateQueriesSpy = vi.spyOn(client, 'invalidateQueries');
    await user.click(favoriteButton);

    expect(unfavoriteNamedResource).toHaveBeenCalledWith('categories', 'category-1');
    await waitFor(() =>
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: ['categories'] }),
    );
  });

  it('shows an error toast when favorite update fails with an api code', async () => {
    const user = userEvent.setup();
    const error = new Error('boom');

    favoriteNamedResource.mockRejectedValueOnce(error);
    normalizeApiError.mockReturnValue({
      code: 'CATEGORY_ALREADY_EXISTS',
      message: 'Already exists',
    });

    renderPreview();

    await user.click(
      screen.getByRole('button', { name: 'namedResources:favoriteNamedResource' }),
    );

    await waitFor(() =>
      expect(pushToast).toHaveBeenCalledWith({
        variant: 'error',
        title: 'category-errors:CATEGORY_ALREADY_EXISTS',
      }),
    );
  });

  it('rolls back favorite optimistic updates when the request fails', async () => {
    const user = userEvent.setup();
    const error = new Error('boom');
    const secondResource = {
      ...userResource,
      id: 'category-2',
      name: 'Travel',
      nameNormalized: 'travel',
      isFavorite: true,
    };
    favoriteNamedResource.mockRejectedValueOnce(error);
    normalizeApiError.mockReturnValue({
      message: 'Plain favorite error message',
    });
    const { client } = renderPreview();
    client.setQueryData(
      ['categories'],
      [{ ...userResource, isFavorite: false }, secondResource],
    );

    await user.click(
      screen.getByRole('button', { name: 'namedResources:favoriteNamedResource' }),
    );

    await waitFor(() =>
      expect(client.getQueryData(['categories'])).toEqual([
        { ...userResource, isFavorite: false },
        secondResource,
      ]),
    );
  });

  it('shows a favorite error toast when optimistic setup fails before context is created', async () => {
    const user = userEvent.setup();
    const error = new Error('cancel failed');

    normalizeApiError.mockReturnValue({
      message: 'Cancel failed',
    });

    const { client } = renderPreview();
    vi.spyOn(client, 'cancelQueries').mockRejectedValueOnce(error);

    await user.click(
      screen.getByRole('button', { name: 'namedResources:favoriteNamedResource' }),
    );

    await waitFor(() =>
      expect(pushToast).toHaveBeenCalledWith({
        variant: 'error',
        title: 'Groceries',
        message: 'Cancel failed',
      }),
    );
  });

  it('shows an unfavorite error toast when optimistic setup fails before context is created', async () => {
    const user = userEvent.setup();
    const error = new Error('cancel failed');

    normalizeApiError.mockReturnValue({
      message: 'Cancel failed',
    });

    const { client } = renderPreview({ ...userResource, isFavorite: true });
    vi.spyOn(client, 'cancelQueries').mockRejectedValueOnce(error);

    await user.click(
      screen.getByRole('button', { name: 'namedResources:unfavoriteNamedResource' }),
    );

    await waitFor(() =>
      expect(pushToast).toHaveBeenCalledWith({
        variant: 'error',
        title: 'Groceries',
        message: 'Cancel failed',
      }),
    );
  });

  it('does not trigger a mutation when favorite state changes between the two guard checks', async () => {
    const user = userEvent.setup();
    let accessCount = 0;
    const flickeringFavoriteResource = {
      ...userResource,
      get isFavorite() {
        accessCount += 1;
        return accessCount >= 4;
      },
    };

    renderPreview(flickeringFavoriteResource);

    await user.click(
      screen.getByRole('button', { name: 'namedResources:favoriteNamedResource' }),
    );

    expect(favoriteNamedResource).not.toHaveBeenCalled();
    expect(unfavoriteNamedResource).not.toHaveBeenCalled();
  });

  it('shows an error toast with fallback message when favorite update fails without code', async () => {
    const user = userEvent.setup();
    const error = new Error('boom');

    favoriteNamedResource.mockRejectedValueOnce(error);
    normalizeApiError.mockReturnValue({
      message: 'Plain favorite error message',
    });

    renderPreview();

    await user.click(
      screen.getByRole('button', { name: 'namedResources:favoriteNamedResource' }),
    );

    await waitFor(() =>
      expect(pushToast).toHaveBeenCalledWith({
        variant: 'error',
        title: 'Groceries',
        message: 'Plain favorite error message',
      }),
    );
  });

  it('rolls back unfavorite optimistic updates when the request fails', async () => {
    const user = userEvent.setup();
    const error = new Error('boom');
    const secondResource = {
      ...userResource,
      id: 'category-2',
      name: 'Travel',
      nameNormalized: 'travel',
    };
    unfavoriteNamedResource.mockRejectedValueOnce(error);
    normalizeApiError.mockReturnValue({
      message: 'Plain favorite error message',
    });
    const { client } = renderPreview({ ...userResource, isFavorite: true });
    client.setQueryData(
      ['categories'],
      [{ ...userResource, isFavorite: true }, secondResource],
    );

    await user.click(
      screen.getByRole('button', { name: 'namedResources:unfavoriteNamedResource' }),
    );

    await waitFor(() =>
      expect(client.getQueryData(['categories'])).toEqual([
        { ...userResource, isFavorite: true },
        secondResource,
      ]),
    );
  });

  it('updates a user resource name after a successful edit', async () => {
    const user = userEvent.setup();

    updateNamedResource.mockResolvedValueOnce({
      ...userResource,
      name: 'Updated groceries',
    });

    renderPreview();

    await user.click(screen.getAllByRole('button')[0]);
    expect(screen.getByLabelText('edit named resource')).toHaveFocus();

    const input = screen.getByLabelText('edit named resource');
    await user.clear(input);
    await user.type(input, 'Updated groceries');
    await user.click(screen.getByRole('button', { name: 'save named resource' }));

    await waitFor(() =>
      expect(updateNamedResource).toHaveBeenCalledWith(
        'categories',
        'category-1',
        'Updated groceries',
      ),
    );
    expect(screen.getByText('Updated groceries')).toBeInTheDocument();
    expect(pushToast).toHaveBeenCalledWith({
      variant: 'success',
      title: 'namedResources:resourceUpdatedTitleCategory',
    });
  });

  it('shows an error toast when update fails', async () => {
    const user = userEvent.setup();
    const error = new Error('boom');

    updateNamedResource.mockRejectedValueOnce(error);
    normalizeApiError.mockReturnValue({
      code: 'CATEGORY_ALREADY_EXISTS',
      message: 'Already exists',
    });

    renderPreview();

    await user.click(screen.getAllByRole('button')[0]);
    const input = screen.getByLabelText('edit named resource');
    await user.clear(input);
    await user.type(input, 'Duplicate');
    await user.click(screen.getByRole('button', { name: 'save named resource' }));

    await waitFor(() =>
      expect(pushToast).toHaveBeenCalledWith({
        variant: 'error',
        title: 'category-errors:CATEGORY_ALREADY_EXISTS',
      }),
    );
  });

  it('falls back to the api error message when no error code is present', async () => {
    const user = userEvent.setup();
    const error = new Error('boom');

    updateNamedResource.mockRejectedValueOnce(error);
    normalizeApiError.mockReturnValue({
      message: 'Plain api error message',
    });

    renderPreview();

    await user.click(screen.getAllByRole('button')[0]);
    const input = screen.getByLabelText('edit named resource');
    await user.clear(input);
    await user.type(input, 'Duplicate');
    await user.click(screen.getByRole('button', { name: 'save named resource' }));

    await waitFor(() =>
      expect(pushToast).toHaveBeenCalledWith({
        variant: 'error',
        title: 'Duplicate',
        message: 'Plain api error message',
      }),
    );
  });

  it('falls back to the current saved name when the input ref is unavailable', async () => {
    const user = userEvent.setup();
    const error = new Error('boom');

    updateNamedResource.mockRejectedValueOnce(error);
    normalizeApiError.mockReturnValue({
      message: 'Plain api error message',
    });

    renderPreview();

    await user.click(screen.getAllByRole('button')[0]);
    await user.click(
      screen.getByRole('button', { name: 'save named resource without ref' }),
    );

    await waitFor(() =>
      expect(pushToast).toHaveBeenCalledWith({
        variant: 'error',
        title: 'Groceries',
        message: 'Plain api error message',
      }),
    );
  });

  it('opens a confirmation modal before deleting a user resource', async () => {
    const user = userEvent.setup();

    renderPreview();

    await user.click(screen.getAllByRole('button')[1]);

    expect(
      screen.getByRole('dialog', {
        name: 'namedResources:deleteResourceModalTitleCategory',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('namedResources:deleteResourceModalHintCategory'),
    ).toBeInTheDocument();
    expect(deleteNamedResource).not.toHaveBeenCalled();
  });

  it('deletes a user resource after confirmation and shows a success toast', async () => {
    const user = userEvent.setup();

    deleteNamedResource.mockResolvedValueOnce({ acknowledged: true, deletedCount: 1 });

    const { client } = renderPreview();
    const invalidateQueriesSpy = vi.spyOn(client, 'invalidateQueries');

    await user.click(screen.getAllByRole('button')[1]);
    await user.click(
      screen.getByRole('button', { name: 'namedResources:confirmDeletion' }),
    );

    await waitFor(() =>
      expect(deleteNamedResource).toHaveBeenCalledWith('categories', 'category-1'),
    );
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: ['categories'] });
    expect(pushToast).toHaveBeenCalledWith({
      variant: 'success',
      title: 'namedResources:resourceDeletedTitleCategory',
    });
  });

  it('shows an error modal when deletion fails without closing the modal', async () => {
    const user = userEvent.setup();
    const error = new Error('boom');

    deleteNamedResource.mockRejectedValueOnce(error);
    normalizeApiError.mockReturnValue({
      code: 'CATEGORY_DEPENDENCY_ERROR',
      message: 'Fallback delete error',
    });

    renderPreview();

    await user.click(screen.getAllByRole('button')[1]);
    await user.click(
      screen.getByRole('button', { name: 'namedResources:confirmDeletion' }),
    );

    expect(
      await screen.findByRole('heading', {
        name: 'namedResources:deleteResourceErrorTitleCategory',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('category-errors:CATEGORY_DEPENDENCY_ERROR'),
    ).toBeInTheDocument();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'namedResources:closeModal' }),
    ).toHaveFocus();
    expect(screen.getAllByRole('button')[1]).not.toHaveFocus();
    expect(pushToast).not.toHaveBeenCalled();
  });

  it('falls back to the api error message when delete error code is missing', async () => {
    const user = userEvent.setup();
    const error = new Error('boom');

    deleteNamedResource.mockRejectedValueOnce(error);
    normalizeApiError.mockReturnValue({
      message: 'Plain delete error message',
    });

    renderPreview();

    await user.click(screen.getAllByRole('button')[1]);
    await user.click(
      screen.getByRole('button', { name: 'namedResources:confirmDeletion' }),
    );

    expect(
      await screen.findByRole('heading', {
        name: 'namedResources:deleteResourceErrorTitleCategory',
      }),
    ).toBeInTheDocument();
    expect(screen.getByText('Plain delete error message')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'namedResources:closeModal' }),
    ).toHaveFocus();
  });

  it('moves focus back to the preview delete button when the modal closes', async () => {
    const user = userEvent.setup();
    const error = new Error('boom');

    deleteNamedResource.mockRejectedValueOnce(error);
    normalizeApiError.mockReturnValue({
      code: 'CATEGORY_DEPENDENCY_ERROR',
      message: 'Fallback delete error',
    });

    renderPreview();

    const previewDeleteButton = screen.getAllByRole('button')[1];

    await user.click(previewDeleteButton);
    await user.click(
      screen.getByRole('button', { name: 'namedResources:confirmDeletion' }),
    );
    expect(
      await screen.findByText('category-errors:CATEGORY_DEPENDENCY_ERROR'),
    ).toBeInTheDocument();

    expect(previewDeleteButton).not.toHaveFocus();

    await user.click(screen.getByRole('button', { name: 'namedResources:closeModal' }));

    await waitFor(() =>
      expect(
        screen.queryByRole('dialog', {
          name: 'namedResources:deleteResourceModalTitleCategory',
        }),
      ).not.toBeInTheDocument(),
    );
    expect(previewDeleteButton).toHaveFocus();
  });
});
