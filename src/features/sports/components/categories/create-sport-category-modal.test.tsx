import '@shared/i18n';

import { fireEvent, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { renderWithProviders } from '@test-utils';

import * as categoriesApi from '../../api/sport-categories-api';
import type { SportCategory } from '../../api/types';

import { CreateSportCategoryModal } from './create-sport-category-modal';

vi.mock('../../api/sport-categories-api', () => ({
  createSportCategory: vi.fn(),
  getSportCategories: vi.fn(),
}));

const mockCreatedCategory: SportCategory = {
  id: 'cat-new-1',
  name: 'Swimming',
  nameNormalized: 'swimming',
  type: 'user',
  isFavorite: false,
};

describe('CreateSportCategoryModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('validates required name field', async () => {
    renderWithProviders(<CreateSportCategoryModal isOpen={true} onClose={vi.fn()} />);

    const submitBtn = screen.getByTestId('sport-category-form-submit');
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText('Category name is required')).toBeInTheDocument();
    });
    expect(categoriesApi.createSportCategory).not.toHaveBeenCalled();
  });

  it('calls createSportCategory and invokes onSuccess and onClose', async () => {
    vi.mocked(categoriesApi.createSportCategory).mockResolvedValue(mockCreatedCategory);
    const onClose = vi.fn();
    const onSuccess = vi.fn();

    renderWithProviders(
      <CreateSportCategoryModal isOpen={true} onClose={onClose} onSuccess={onSuccess} />,
    );

    const nameInput = screen.getByTestId('sport-category-name-input');
    fireEvent.change(nameInput, { target: { value: 'Swimming' } });

    const submitBtn = screen.getByTestId('sport-category-form-submit');
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(categoriesApi.createSportCategory).toHaveBeenCalledWith({
        name: 'Swimming',
      });
    });

    await waitFor(() => {
      expect(onClose).toHaveBeenCalled();
      expect(onSuccess).toHaveBeenCalledWith(mockCreatedCategory);
    });
  });

  it('handles cancel button click', () => {
    const onClose = vi.fn();

    renderWithProviders(<CreateSportCategoryModal isOpen={true} onClose={onClose} />);

    const cancelBtn = screen.getByTestId('sport-category-form-cancel');
    fireEvent.click(cancelBtn);

    expect(onClose).toHaveBeenCalled();
  });
});
