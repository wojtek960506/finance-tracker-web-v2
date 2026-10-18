import '@shared/i18n';

import { fireEvent, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { renderWithProviders } from '@test-utils';

import type { SportEntry } from '../../api';
import * as entriesApi from '../../api/sport-entries-api';

import { DeleteSportActivityModal } from './sport-activity-delete-modal';

vi.mock('../../api/sport-entries-api', () => ({
  deleteSportEntry: vi.fn(),
}));

const mockEntry: SportEntry = {
  id: 'entry-1',
  ownerId: 'owner-1',
  categoryId: 'cat-running',
  category: {
    id: 'cat-running',
    name: 'Running',
    type: 'user',
  },
  date: '2026-05-15T10:00:00.000Z',
  itemName: 'Running Shoes',
  costPln: 250,
  createdAt: '2026-05-15T10:00:00.000Z',
  updatedAt: '2026-05-15T10:00:00.000Z',
};

const mockLinkedEntry: SportEntry = {
  ...mockEntry,
  id: 'entry-2',
  itemName: 'Gym Membership',
  costPln: 150,
  transactionId: 'tx-123',
};

describe('DeleteSportActivityModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders modal with activity details (name, date, cost, category)', () => {
    renderWithProviders(
      <DeleteSportActivityModal isOpen={true} onClose={vi.fn()} item={mockEntry} />,
    );

    expect(screen.getByTestId('delete-sport-activity-modal')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Delete Activity' })).toBeInTheDocument();
    expect(screen.getByText('Running Shoes')).toBeInTheDocument();
    expect(screen.getByText('Running')).toBeInTheDocument();
    expect(screen.getByText(/250.00 PLN/)).toBeInTheDocument();
    expect(screen.queryByTestId('sport-activity-linked-warning')).not.toBeInTheDocument();
  });

  it('renders warning when activity is linked to a transaction', () => {
    renderWithProviders(
      <DeleteSportActivityModal isOpen={true} onClose={vi.fn()} item={mockLinkedEntry} />,
    );

    expect(screen.getByTestId('sport-activity-linked-warning')).toBeInTheDocument();
    expect(screen.getByText('Linked')).toBeInTheDocument();
    expect(
      screen.getByText(
        'This activity is linked to a transaction. Deleting it will also unlink it.',
      ),
    ).toBeInTheDocument();
  });

  it('triggers delete mutation and calls onClose on confirm', async () => {
    const handleClose = vi.fn();
    const handleSuccess = vi.fn();
    vi.mocked(entriesApi.deleteSportEntry).mockResolvedValue(undefined);

    renderWithProviders(
      <DeleteSportActivityModal
        isOpen={true}
        onClose={handleClose}
        item={mockEntry}
        onSuccess={handleSuccess}
      />,
    );

    const confirmBtn = screen.getByTestId('confirm-delete-sport-activity-button');
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(entriesApi.deleteSportEntry).toHaveBeenCalledWith('entry-1');
    });
    expect(handleClose).toHaveBeenCalled();
  });

  it('calls onClose when cancel button is clicked', () => {
    const handleClose = vi.fn();

    renderWithProviders(
      <DeleteSportActivityModal isOpen={true} onClose={handleClose} item={mockEntry} />,
    );

    const cancelBtn = screen.getByTestId('cancel-delete-sport-activity-button');
    fireEvent.click(cancelBtn);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('returns null if item is null', () => {
    const { container } = renderWithProviders(
      <DeleteSportActivityModal isOpen={true} onClose={vi.fn()} item={null} />,
    );

    expect(container).toBeEmptyDOMElement();
  });
});
