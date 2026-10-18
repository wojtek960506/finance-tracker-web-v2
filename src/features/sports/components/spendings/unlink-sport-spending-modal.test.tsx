import '@shared/i18n';

import { QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createTestQueryClient } from '@test-utils/create-test-query-client';

import * as sportsApi from '../../api/sport-spendings-api';
import type { SportSpendingTarget } from '../../api/types';

import { UnlinkSportSpendingModal } from './unlink-sport-spending-modal';

describe('UnlinkSportSpendingModal', () => {
  let queryClient = createTestQueryClient();

  const mockTarget: SportSpendingTarget = {
    id: 'entry-1',
    costPln: 120,
    date: '2026-10-15T00:00:00.000Z',
    itemName: 'Gym Membership',
    categoryName: 'Gym',
    transactionId: 'tx-1',
  };

  beforeEach(() => {
    queryClient = createTestQueryClient();
    vi.clearAllMocks();
  });

  const renderModal = (props: {
    isOpen?: boolean;
    target?: SportSpendingTarget | null;
    onClose?: () => void;
    onSuccess?: () => void;
  }) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <UnlinkSportSpendingModal
          isOpen={props.isOpen ?? true}
          target={props.target !== undefined ? props.target : mockTarget}
          onClose={props.onClose ?? vi.fn()}
          onSuccess={props.onSuccess ?? vi.fn()}
        />
      </QueryClientProvider>,
    );
  };

  it('does not render when target is null', () => {
    renderModal({ target: null });
    expect(screen.queryByTestId('unlink-sport-spending-modal')).not.toBeInTheDocument();
  });

  it('renders target details correctly', () => {
    renderModal({});

    expect(screen.getByText('Gym Membership')).toBeInTheDocument();
    expect(screen.getByText(/• Gym/)).toBeInTheDocument();
    expect(screen.getByText(/120/)).toBeInTheDocument();
  });

  it('calls onClose when cancel is clicked', () => {
    const onClose = vi.fn();
    renderModal({ onClose });

    fireEvent.click(screen.getByTestId('cancel-delete-unlink-sport-spending-button'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('unlinks spending when confirm is clicked', async () => {
    const unlinkSpy = vi
      .spyOn(sportsApi, 'unlinkSportSpending')
      .mockResolvedValueOnce({ acknowledged: true, modifiedCount: 1 });
    const onSuccess = vi.fn();
    const onClose = vi.fn();

    renderModal({ onSuccess, onClose });

    fireEvent.click(screen.getByTestId('confirm-delete-unlink-sport-spending-button'));

    await waitFor(() => {
      expect(unlinkSpy).toHaveBeenCalledWith({ entryId: 'entry-1' });
      expect(onSuccess).toHaveBeenCalledTimes(1);
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });
});
