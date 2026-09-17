import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { renderWithProviders } from '@test-utils';

import { OperationKindBadge } from './operation-kind-badge';

describe('OperationKindBadge', () => {
  it('renders snapshot badge correctly', () => {
    renderWithProviders(<OperationKindBadge kind="snapshot" />);
    expect(screen.getByTestId('operation-kind-badge')).toBeInTheDocument();
  });

  it('renders buy badge correctly', () => {
    renderWithProviders(<OperationKindBadge kind="buy" />);
    expect(screen.getByTestId('operation-kind-badge')).toBeInTheDocument();
  });

  it('renders sell badge correctly', () => {
    renderWithProviders(<OperationKindBadge kind="sell" />);
    expect(screen.getByTestId('operation-kind-badge')).toBeInTheDocument();
  });

  it('renders interest badge correctly', () => {
    renderWithProviders(<OperationKindBadge kind="interest" />);
    expect(screen.getByTestId('operation-kind-badge')).toBeInTheDocument();
  });

  it('renders fee badge correctly', () => {
    renderWithProviders(<OperationKindBadge kind="fee" />);
    expect(screen.getByTestId('operation-kind-badge')).toBeInTheDocument();
  });
});
