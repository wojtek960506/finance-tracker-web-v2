import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { renderWithProviders } from '@test-utils';

import { InstrumentKindBadge } from './instrument-kind-badge';

describe('InstrumentKindBadge', () => {
  it('renders badge for share kind', () => {
    renderWithProviders(<InstrumentKindBadge kind="share" />);
    expect(screen.getByTestId('instrument-kind-badge')).toBeInTheDocument();
    expect(screen.getByText(/share/i)).toBeInTheDocument();
  });

  it('renders badge for crypto kind', () => {
    renderWithProviders(<InstrumentKindBadge kind="crypto" />);
    expect(screen.getByTestId('instrument-kind-badge')).toBeInTheDocument();
    expect(screen.getByText(/crypto/i)).toBeInTheDocument();
  });

  it('applies custom className', () => {
    renderWithProviders(<InstrumentKindBadge kind="fund" className="custom-class" />);
    expect(screen.getByTestId('instrument-kind-badge')).toHaveClass('custom-class');
  });
});
