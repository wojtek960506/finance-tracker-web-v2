import { fireEvent, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { renderWithProviders } from '@test-utils';

import * as entriesApi from '../../api/sport-entries-api';
import type { SportCategory, SportEntry } from '../../api/types';

import { CreateSportActivityModal } from './sport-activity-create-modal';

vi.mock('../../api/sport-entries-api', () => ({
  createSportEntry: vi.fn(),
  updateSportEntry: vi.fn(),
  deleteSportEntry: vi.fn(),
}));

const mockCategories: SportCategory[] = [
  {
    id: 'cat-1',
    name: 'Running',
    nameNormalized: 'running',
    type: 'system',
    isFavorite: true,
  },
];

const mockCreatedEntry: SportEntry = {
  id: 'entry-new-1',
  ownerId: 'user-1',
  categoryId: 'cat-1',
  category: {
    id: 'cat-1',
    name: 'Running',
    type: 'system',
  },
  date: '2026-05-10T00:00:00Z',
  itemName: 'Running Shoes',
  costPln: 350,
  createdAt: '2026-05-10T12:00:00Z',
  updatedAt: '2026-05-10T12:00:00Z',
};

describe('CreateSportActivityModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls createSportEntry on submit and closes modal on success', async () => {
    vi.mocked(entriesApi.createSportEntry).mockResolvedValue(mockCreatedEntry);
    const onClose = vi.fn();
    const onSuccess = vi.fn();

    renderWithProviders(
      <CreateSportActivityModal
        isOpen={true}
        onClose={onClose}
        categories={mockCategories}
        defaultCategoryId="cat-1"
        onSuccess={onSuccess}
      />,
    );

    const nameInput = screen.getByTestId('sport-activity-item-name-input');
    fireEvent.change(nameInput, { target: { value: 'Running Shoes' } });

    const costInput = screen.getByTestId('sport-activity-cost-input');
    fireEvent.change(costInput, { target: { value: '350' } });

    const submitBtn = screen.getByTestId('sport-activity-form-submit');
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(entriesApi.createSportEntry).toHaveBeenCalledWith(
        expect.objectContaining({
          categoryId: 'cat-1',
          itemName: 'Running Shoes',
          costPln: 350,
        }),
      );
    });

    await waitFor(() => {
      expect(onClose).toHaveBeenCalled();
      expect(onSuccess).toHaveBeenCalledWith(mockCreatedEntry);
    });
  });

  it('does not close modal on error', async () => {
    vi.mocked(entriesApi.createSportEntry).mockRejectedValue(new Error('Network error'));
    const onClose = vi.fn();

    renderWithProviders(
      <CreateSportActivityModal
        isOpen={true}
        onClose={onClose}
        categories={mockCategories}
        defaultCategoryId="cat-1"
      />,
    );

    const nameInput = screen.getByTestId('sport-activity-item-name-input');
    fireEvent.change(nameInput, { target: { value: 'Running Shoes' } });

    const costInput = screen.getByTestId('sport-activity-cost-input');
    fireEvent.change(costInput, { target: { value: '350' } });

    const submitBtn = screen.getByTestId('sport-activity-form-submit');
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(entriesApi.createSportEntry).toHaveBeenCalled();
    });

    expect(onClose).not.toHaveBeenCalled();
  });
});
