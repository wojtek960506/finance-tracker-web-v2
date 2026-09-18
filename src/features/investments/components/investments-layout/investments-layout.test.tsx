import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { renderWithProviders } from '@test-utils';

import { InvestmentsLayout } from './investments-layout';

describe('InvestmentsLayout', () => {
  it('renders tabs and child content', () => {
    renderWithProviders(
      <InvestmentsLayout>
        <div data-testid="test-child">Child Content</div>
      </InvestmentsLayout>,
    );

    expect(
      screen.getByRole('navigation', { name: 'Investments navigation' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Portfolio' })).toHaveAttribute(
      'href',
      '/investments/portfolio',
    );
    expect(screen.getByRole('link', { name: 'Instruments' })).toHaveAttribute(
      'href',
      '/investments/instruments',
    );
    expect(screen.getByRole('link', { name: 'Operations' })).toHaveAttribute(
      'href',
      '/investments/operations',
    );
    expect(screen.getByTestId('test-child')).toBeInTheDocument();
  });
});
