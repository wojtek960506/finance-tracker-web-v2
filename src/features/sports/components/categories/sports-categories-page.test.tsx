import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { SportCategory } from '../../api';

import { SportsCategoriesPage } from './sports-categories-page';

const mockCategories: SportCategory[] = [
  {
    id: 'cat-sys-1',
    name: 'other',
    nameNormalized: 'other',
    type: 'system',
    isFavorite: false,
  },
  {
    id: 'cat-usr-1',
    name: 'Bouldering',
    nameNormalized: 'Bouldering',
    type: 'user',
    isFavorite: true,
  },
  {
    id: 'cat-usr-2',
    name: 'Swimming',
    nameNormalized: 'Swimming',
    type: 'user',
    isFavorite: false,
  },
];

const mockMutations = {
  createCategory: vi.fn(),
  isCreating: false,
  updateCategory: vi.fn(),
  isUpdating: false,
  deleteCategory: vi.fn(),
  isDeleting: false,
  favoriteCategory: vi.fn(),
  isFavoriting: false,
  unfavoriteCategory: vi.fn(),
  isUnfavoriting: false,
};

const mockUseSportCategories = vi.fn();

vi.mock('../../hooks', () => ({
  useSportCategories: () => mockUseSportCategories(),
  useSportCategoryMutations: () => mockMutations,
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, opts?: { name?: string }) => {
      if (opts?.name) return `${key}:${opts.name}`;
      return key;
    },
    i18n: { language: 'en' },
  }),
}));

vi.mock('@named-resources/components/named-resource-input', () => ({
  NamedResourceInput: ({
    initialValue,
    action,
    setIsVisible,
  }: {
    initialValue: string;
    action: (val: string) => Promise<void>;
    setIsVisible: (vis: boolean) => void;
  }) => (
    <div data-testid="mock-named-resource-input">
      <input
        data-testid="mock-input"
        defaultValue={initialValue}
        onChange={(e) => {
          e.target.dataset.value = e.target.value;
        }}
      />
      <button
        type="button"
        data-testid="mock-submit"
        onClick={() => void action('Updated Name')}
      >
        Submit
      </button>
      <button type="button" data-testid="mock-cancel" onClick={() => setIsVisible(false)}>
        Cancel
      </button>
    </div>
  ),
}));

describe('SportsCategoriesPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading indicator when fetching categories', () => {
    mockUseSportCategories.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
      refetch: vi.fn(),
    });

    render(<SportsCategoriesPage />);

    expect(screen.getByText('categories.allCategories')).toBeInTheDocument();
  });

  it('renders error message and retry button when query fails', async () => {
    const mockRefetch = vi.fn();
    mockUseSportCategories.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('Network error'),
      refetch: mockRefetch,
    });

    render(<SportsCategoriesPage />);

    expect(screen.getByText('toasts.categoryCreateError')).toBeInTheDocument();
    expect(screen.getByText('Network error')).toBeInTheDocument();

    const retryButton = screen.getByRole('button', { name: 'stats.emptyStats' });
    await userEvent.click(retryButton);

    expect(mockRefetch).toHaveBeenCalled();
  });

  it('renders empty state when there are no categories', () => {
    mockUseSportCategories.mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<SportsCategoriesPage />);

    expect(screen.getByText('categories.empty')).toBeInTheDocument();
  });

  it('renders categories and opens creation input on Add Category click', async () => {
    mockUseSportCategories.mockReturnValue({
      data: mockCategories,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<SportsCategoriesPage />);

    expect(screen.getByText('Bouldering')).toBeInTheDocument();
    expect(screen.getByText('Swimming')).toBeInTheDocument();

    expect(screen.queryByTestId('edit-category-cat-sys-1')).not.toBeInTheDocument();
    expect(screen.queryByTestId('delete-category-cat-sys-1')).not.toBeInTheDocument();

    expect(screen.getByTestId('edit-category-cat-usr-1')).toBeInTheDocument();
    expect(screen.getByTestId('delete-category-cat-usr-1')).toBeInTheDocument();

    const addButton = screen.getByTestId('create-sport-category-button');
    await userEvent.click(addButton);

    expect(screen.getByTestId('mock-named-resource-input')).toBeInTheDocument();
  });

  it('allows inline editing of a custom category', async () => {
    mockMutations.updateCategory.mockResolvedValueOnce(undefined);
    mockUseSportCategories.mockReturnValue({
      data: mockCategories,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<SportsCategoriesPage />);

    const editBtn = screen.getByTestId('edit-category-cat-usr-1');
    await userEvent.click(editBtn);

    expect(screen.getByTestId('mock-named-resource-input')).toBeInTheDocument();

    const submitBtn = screen.getByTestId('mock-submit');
    await userEvent.click(submitBtn);

    expect(mockMutations.updateCategory).toHaveBeenCalledWith({
      id: 'cat-usr-1',
      data: { name: 'Updated Name' },
    });
  });

  it('calls favorite and unfavorite mutations on star clicks', async () => {
    mockUseSportCategories.mockReturnValue({
      data: mockCategories,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<SportsCategoriesPage />);

    const favButton1 = screen.getByTestId('favorite-category-cat-usr-1');
    await userEvent.click(favButton1);
    expect(mockMutations.unfavoriteCategory).toHaveBeenCalledWith('cat-usr-1');

    const favButton2 = screen.getByTestId('favorite-category-cat-usr-2');
    await userEvent.click(favButton2);
    expect(mockMutations.favoriteCategory).toHaveBeenCalledWith('cat-usr-2');
  });

  it('opens delete modal and confirms deletion', async () => {
    mockMutations.deleteCategory.mockResolvedValueOnce(undefined);
    mockUseSportCategories.mockReturnValue({
      data: mockCategories,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<SportsCategoriesPage />);

    const deleteBtn = screen.getByTestId('delete-category-cat-usr-1');
    await userEvent.click(deleteBtn);

    expect(screen.getByTestId('delete-sport-category-modal')).toBeInTheDocument();

    const confirmBtn = screen.getByTestId('confirm-delete-sport-category-button');
    await userEvent.click(confirmBtn);

    expect(mockMutations.deleteCategory).toHaveBeenCalledWith('cat-usr-1');
  });

  it('cancels deletion when cancel button is clicked in delete modal', async () => {
    mockUseSportCategories.mockReturnValue({
      data: mockCategories,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<SportsCategoriesPage />);

    const deleteBtn = screen.getByTestId('delete-category-cat-usr-1');
    await userEvent.click(deleteBtn);

    const cancelBtn = screen.getByTestId('cancel-delete-sport-category-button');
    await userEvent.click(cancelBtn);

    expect(screen.queryByTestId('delete-sport-category-modal')).not.toBeInTheDocument();
    expect(mockMutations.deleteCategory).not.toHaveBeenCalled();
  });

  it('displays error in delete modal when deletion fails and allows closing', async () => {
    mockMutations.deleteCategory.mockRejectedValueOnce(
      new Error('Category has associated activities'),
    );
    mockUseSportCategories.mockReturnValue({
      data: mockCategories,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<SportsCategoriesPage />);

    const deleteBtn = screen.getByTestId('delete-category-cat-usr-1');
    await userEvent.click(deleteBtn);

    const confirmBtn = screen.getByTestId('confirm-delete-sport-category-button');
    await userEvent.click(confirmBtn);

    expect(screen.getByText('Category has associated activities')).toBeInTheDocument();

    const closeBtn = screen.getByTestId('close-delete-sport-category-error-button');
    await userEvent.click(closeBtn);

    expect(screen.queryByTestId('delete-sport-category-modal')).not.toBeInTheDocument();
  });
});
