import { fireEvent, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { renderWithProviders } from '@test-utils';

import * as entriesApi from '../../api/sport-entries-api';
import type { SportCategory, SportEntry } from '../../api/types';

import { UpdateSportActivityModal } from './sport-activity-update-modal';

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
  {
    id: 'cat-2',
    name: 'Cycling',
    nameNormalized: 'cycling',
    type: 'system',
    isFavorite: false,
  },
];

const mockExistingEntry: SportEntry = {
  id: 'entry-123',
  ownerId: 'user-1',
  categoryId: 'cat-1',
  category: {
    id: 'cat-1',
    name: 'Running',
    type: 'system',
  },
  date: '2026-04-15T00:00:00Z',
  itemName: 'Old Marathon Registration',
  costPln: 200,
  description: 'Initial entry',
  transactionId: null,
  createdAt: '2026-04-15T12:00:00Z',
  updatedAt: '2026-04-15T12:00:00Z',
};

describe('UpdateSportActivityModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders nothing when item is null', () => {
    const { container } = renderWithProviders(
      <UpdateSportActivityModal
        isOpen={true}
        onClose={vi.fn()}
        categories={mockCategories}
        item={null}
      />,
    );

    expect(container.firstChild).toBeNull();
  });

  it('pre-fills existing activity data in form fields', () => {
    renderWithProviders(
      <UpdateSportActivityModal
        isOpen={true}
        onClose={vi.fn()}
        categories={mockCategories}
        item={mockExistingEntry}
      />,
    );

    const nameInput = screen.getByTestId('sport-activity-item-name-input');
    const costInput = screen.getByTestId('sport-activity-cost-input');

    expect(nameInput).toHaveValue('Old Marathon Registration');
    expect(costInput).toHaveValue(200);
  });

  it('calls updateSportEntry on submit and closes modal on success', async () => {
    const updatedEntry: SportEntry = {
      ...mockExistingEntry,
      itemName: 'Updated Marathon Fee',
      costPln: 250,
    };
    vi.mocked(entriesApi.updateSportEntry).mockResolvedValue(updatedEntry);

    const onClose = vi.fn();
    const onSuccess = vi.fn();

    renderWithProviders(
      <UpdateSportActivityModal
        isOpen={true}
        onClose={onClose}
        categories={mockCategories}
        item={mockExistingEntry}
        onSuccess={onSuccess}
      />,
    );

    const nameInput = screen.getByTestId('sport-activity-item-name-input');
    fireEvent.change(nameInput, { target: { value: 'Updated Marathon Fee' } });

    const costInput = screen.getByTestId('sport-activity-cost-input');
    fireEvent.change(costInput, { target: { value: '250' } });

    const submitBtn = screen.getByTestId('sport-activity-form-submit');
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(entriesApi.updateSportEntry).toHaveBeenCalledWith(
        'entry-123',
        expect.objectContaining({
          categoryId: 'cat-1',
          itemName: 'Updated Marathon Fee',
          costPln: 250,
        }),
      );
    });

    await waitFor(() => {
      expect(onClose).toHaveBeenCalled();
      expect(onSuccess).toHaveBeenCalledWith(updatedEntry);
    });
  });

  it('does not close modal on update error', async () => {
    vi.mocked(entriesApi.updateSportEntry).mockRejectedValue(
      new Error('Failed to update entry'),
    );
    const onClose = vi.fn();

    renderWithProviders(
      <UpdateSportActivityModal
        isOpen={true}
        onClose={onClose}
        categories={mockCategories}
        item={mockExistingEntry}
      />,
    );

    const submitBtn = screen.getByTestId('sport-activity-form-submit');
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(entriesApi.updateSportEntry).toHaveBeenCalled();
    });

    expect(onClose).not.toHaveBeenCalled();
  });

  it('closes modal when cancel button is clicked', () => {
    const onClose = vi.fn();

    renderWithProviders(
      <UpdateSportActivityModal
        isOpen={true}
        onClose={onClose}
        categories={mockCategories}
        item={mockExistingEntry}
      />,
    );

    const cancelBtn = screen.getByTestId('sport-activity-form-cancel');
    fireEvent.click(cancelBtn);

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
