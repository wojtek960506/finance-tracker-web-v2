import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { renderWithProviders } from '@test-utils';

import { InstrumentStatusBadge } from './instrument-status-badge';

describe('InstrumentStatusBadge', () => {
  it('renders Active badge when isClosed is false', () => {
    renderWithProviders(<InstrumentStatusBadge isClosed={false} />);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('renders Closed badge when isClosed is true', () => {
    renderWithProviders(<InstrumentStatusBadge isClosed={true} />);
    expect(screen.getByText('Closed')).toBeInTheDocument();
  });
});
