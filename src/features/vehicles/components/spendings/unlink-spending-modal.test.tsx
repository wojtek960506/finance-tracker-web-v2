import '@shared/i18n';

import { QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import * as vehiclesApi from '@vehicles/api';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createTestQueryClient } from '@test-utils/create-test-query-client';

import type { SpendingTarget } from './types';
import { UnlinkSpendingModal } from './unlink-spending-modal';

describe('UnlinkSpendingModal', () => {
  let queryClient = createTestQueryClient();

  const mockTarget: SpendingTarget = {
    id: 'fuel-101',
    type: 'fuel',
    costPln: 250,
    date: '2026-10-15T00:00:00.000Z',
    title: 'Orlen Pb95',
    vehicleName: 'Toyota Corolla',
  };

  beforeEach(() => {
    queryClient = createTestQueryClient();
    vi.clearAllMocks();
  });

  const renderModal = (props: {
    isOpen?: boolean;
    target?: SpendingTarget | null;
    onClose?: () => void;
    onSuccess?: () => void;
  }) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <UnlinkSpendingModal
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
    expect(screen.queryByTestId('delete-unlink-spending-modal')).not.toBeInTheDocument();
  });

  it('renders target spending details and confirmation modal', () => {
    renderModal({});

    expect(screen.getByTestId('delete-unlink-spending-modal')).toBeInTheDocument();
    expect(screen.getByText('Orlen Pb95')).toBeInTheDocument();
    expect(screen.getByText(/Toyota Corolla/)).toBeInTheDocument();
  });

  it('calls onClose when cancel button is clicked', () => {
    const onClose = vi.fn();
    renderModal({ onClose });

    const cancelButton = screen.getByTestId('cancel-delete-unlink-spending-button');
    fireEvent.click(cancelButton);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls unlinkSpending and onSuccess on confirmation', async () => {
    const unlinkSpy = vi.spyOn(vehiclesApi, 'unlinkSpending').mockResolvedValueOnce({
      acknowledged: true,
      modifiedCount: 1,
    });
    const onSuccess = vi.fn();
    const onClose = vi.fn();

    renderModal({ onSuccess, onClose });

    const confirmButton = screen.getByTestId('confirm-delete-unlink-spending-button');
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(unlinkSpy).toHaveBeenCalledWith({
        spendingType: 'fuel',
        spendingId: 'fuel-101',
      });
      expect(onSuccess).toHaveBeenCalledTimes(1);
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });
});
