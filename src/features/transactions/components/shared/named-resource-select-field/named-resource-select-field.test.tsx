import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createTestQueryClient } from '@test-utils/create-test-query-client';

import { NamedResourceSelectField } from './named-resource-select-field';

const mocks = vi.hoisted(() => ({
  getNamedResources: vi.fn(),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key, i18n: { language: 'en' } }),
}));

vi.mock('@named-resources/api', () => ({
  getNamedResources: (...args: unknown[]) => mocks.getNamedResources(...args),
}));

vi.mock('@transactions/components/shared', () => ({
  getFavoriteIcon: () => 'favorite-icon',
}));

vi.mock('@/components/ui/select', () => ({
  SelectControl: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
  Select: ({
    children,
    disabled,
  }: React.PropsWithChildren<{ disabled?: boolean }>) => (
    <div data-disabled={disabled ? 'true' : 'false'}>{children}</div>
  ),
  SelectTrigger: ({ children }: React.PropsWithChildren) => <button type="button">{children}</button>,
  SelectValue: ({ placeholder }: { placeholder?: string }) => <span>{placeholder}</span>,
  SelectContent: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
  SelectGroup: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
  SelectItem: ({
    children,
    value,
  }: React.PropsWithChildren<{ value: string }>) => <div data-value={value}>{children}</div>,
  SelectSeparator: () => <hr role="separator" />,
}));

const renderField = (
  props?: Partial<React.ComponentProps<typeof NamedResourceSelectField>>,
) => {
  const client = createTestQueryClient();
  const onChange = vi.fn();

  render(
    <QueryClientProvider client={client}>
      <NamedResourceSelectField
        kind="categories"
        value=""
        onChange={onChange}
        placeholder="Pick resource"
        {...props}
      />
    </QueryClientProvider>,
  );

  return { client, onChange };
};

describe('NamedResourceSelectField', () => {
  beforeEach(() => {
    mocks.getNamedResources.mockReset();
  });

  it('shows loading placeholder while resources are loading', () => {
    mocks.getNamedResources.mockReturnValueOnce(new Promise(() => {}));

    renderField();

    expect(screen.getByText('loadingResources')).toBeInTheDocument();
    expect(screen.getByText('loadingResources').closest('div')).toHaveAttribute(
      'data-disabled',
      'true',
    );
  });

  it('sorts favorites first by displayed label and keeps a separator before the rest', async () => {
    mocks.getNamedResources.mockResolvedValueOnce([
      {
        id: 'cat-user-z',
        name: 'Zoo',
        ownerId: 'user-1',
        type: 'user',
        nameNormalized: 'zoo',
        isFavorite: true,
      },
      {
        id: 'cat-system-other',
        name: 'otherCategory',
        ownerId: '',
        type: 'system',
        nameNormalized: 'othercategory',
        isFavorite: false,
      },
      {
        id: 'cat-user-a',
        name: 'Alpha',
        ownerId: 'user-1',
        type: 'user',
        nameNormalized: 'alpha',
        isFavorite: true,
      },
      {
        id: 'cat-user-b',
        name: 'Travel',
        ownerId: 'user-1',
        type: 'user',
        nameNormalized: 'travel',
        isFavorite: false,
      },
    ]);

    renderField({
      includeSystem: true,
      excludedSystemNames: ['myAccount', 'exchange'],
    });

    await waitFor(() => expect(screen.getByText('Alpha')).toBeInTheDocument());

    const alpha = screen.getByText('Alpha');
    const zoo = screen.getByText('Zoo');
    const separator = screen.getByRole('separator');
    const otherCategory = screen.getByText('otherCategory');
    const travel = screen.getByText('Travel');

    expect(alpha.compareDocumentPosition(zoo) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(
      zoo.compareDocumentPosition(separator) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(
      separator.compareDocumentPosition(otherCategory) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(
      otherCategory.compareDocumentPosition(travel) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(screen.getAllByRole('separator')).toHaveLength(1);
  });

  it('excludes blocked system helper categories while keeping allowed ones', async () => {
    mocks.getNamedResources.mockResolvedValueOnce([
      {
        id: 'cat-system-exchange',
        name: 'exchange',
        ownerId: '',
        type: 'system',
        nameNormalized: 'exchange',
        isFavorite: false,
      },
      {
        id: 'cat-system-other',
        name: 'otherCategory',
        ownerId: '',
        type: 'system',
        nameNormalized: 'othercategory',
        isFavorite: false,
      },
    ]);

    renderField({
      includeSystem: true,
      excludedSystemNames: ['myAccount', 'exchange'],
    });

    await waitFor(() => expect(screen.getByText('otherCategory')).toBeInTheDocument());
    expect(screen.queryByText('exchange')).not.toBeInTheDocument();
  });
});
