import '@shared/i18n';

import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ThemeProvider } from '@context/theme-context';
import { createTestQueryClient } from '@test-utils/create-test-query-client';

import { SpendingModals } from './spending-modals';
import type { SpendingTarget } from './types';

const mockTarget: SpendingTarget = {
  id: 'fuel-1',
  type: 'fuel',
  costPln: 250,
  date: '2026-03-10T10:00:00Z',
  vehicleId: 'veh-1',
  vehicleName: 'Test Vehicle',
};

const renderSpendingModals = (props: React.ComponentProps<typeof SpendingModals>) => {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <SpendingModals {...props} />
      </ThemeProvider>
    </QueryClientProvider>,
  );
};

describe('SpendingModals', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('does not render modals when targets are null', () => {
    renderSpendingModals({
      linkingTarget: null,
      unlinkingTarget: null,
      onCloseLink: vi.fn(),
      onCloseUnlink: vi.fn(),
    });

    expect(screen.queryByTestId('link-spending-modal')).not.toBeInTheDocument();
    expect(screen.queryByTestId('delete-unlink-spending-modal')).not.toBeInTheDocument();
  });

  it('renders LinkSpendingModal when linkingTarget is provided', () => {
    renderSpendingModals({
      linkingTarget: mockTarget,
      unlinkingTarget: null,
      onCloseLink: vi.fn(),
      onCloseUnlink: vi.fn(),
    });

    expect(screen.getByTestId('link-spending-modal')).toBeInTheDocument();
    expect(screen.queryByTestId('delete-unlink-spending-modal')).not.toBeInTheDocument();
  });

  it('renders UnlinkSpendingModal when unlinkingTarget is provided', () => {
    renderSpendingModals({
      linkingTarget: null,
      unlinkingTarget: mockTarget,
      onCloseLink: vi.fn(),
      onCloseUnlink: vi.fn(),
    });

    expect(screen.queryByTestId('link-spending-modal')).not.toBeInTheDocument();
    expect(screen.getByTestId('delete-unlink-spending-modal')).toBeInTheDocument();
  });
});
