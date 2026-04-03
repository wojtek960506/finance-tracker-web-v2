import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { NamedResourceType } from '@named-resources/api';
import { createTestQueryClient } from '@test-utils/create-test-query-client';

import { NamedResourcePreview } from './named-resource-preview';

const pushToast = vi.fn();
const deleteNamedResource = vi.fn();
const updateNamedResource = vi.fn();
const normalizeApiError = vi.fn();

vi.mock('react-i18next', () => ({
  useTranslation: (namespace: string) => ({
    t: (key: string) => `${namespace}:${key}`,
  }),
}));

vi.mock('@named-resources/api', () => ({
  NAMED_RESOURCE_ERROR_NAMESPACE: {
    categories: 'category-errors',
    paymentMethods: 'payment-method-errors',
    accounts: 'account-errors',
  },
  deleteNamedResource: (...args: unknown[]) => deleteNamedResource(...args),
  updateNamedResource: (...args: unknown[]) => updateNamedResource(...args),
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
    updateNamedResource.mockReset();
    normalizeApiError.mockReset();
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

  it('toggles favorite styling', async () => {
    const user = userEvent.setup();
    const { container } = renderPreview();

    const buttons = screen.getAllByRole('button');
    const favoriteButton = buttons[2];
    const starIcon = container.querySelector('svg.lucide-star');

    expect(starIcon).not.toHaveClass('fill-bg');

    await user.click(favoriteButton);

    expect(starIcon).toHaveClass('fill-bg');
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
  });

  it('shows an error toast when update fails', async () => {
    const user = userEvent.setup();
    const error = new Error('boom');

    updateNamedResource.mockRejectedValueOnce(error);
    normalizeApiError.mockReturnValue({
      code: 'RESOURCE_EXISTS',
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
        title: 'Duplicate',
        message: 'category-errors:RESOURCE_EXISTS',
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

  it('deletes a user resource', async () => {
    const user = userEvent.setup();

    deleteNamedResource.mockResolvedValueOnce({ acknowledged: true, deletedCount: 1 });

    renderPreview();

    await user.click(screen.getAllByRole('button')[1]);

    await waitFor(() =>
      expect(deleteNamedResource).toHaveBeenCalledWith('categories', 'category-1'),
    );
  });
});
