import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { VehicleTableShell } from './vehicle-table-shell';

describe('VehicleTableShell', () => {
  it('renders emptyState when isEmpty is true', () => {
    render(
      <VehicleTableShell
        isEmpty={true}
        emptyState={<div data-testid="test-empty">No items</div>}
        testId="test-entries-list"
        headers={<th>Header</th>}
        desktopRows={
          <tr>
            <td>Row</td>
          </tr>
        }
        mobileCards={<div>Card</div>}
      />,
    );

    expect(screen.getByTestId('test-empty')).toBeInTheDocument();
    expect(screen.queryByTestId('test-entries-list')).not.toBeInTheDocument();
  });

  it('renders desktop table and mobile cards when isEmpty is false', () => {
    render(
      <VehicleTableShell
        isEmpty={false}
        emptyState={<div>No items</div>}
        testId="test-entries-list"
        headers={<th>Date Header</th>}
        desktopRows={
          <tr>
            <td>Row 1</td>
          </tr>
        }
        mobileCards={<div data-testid="mobile-card-1">Mobile Card 1</div>}
      />,
    );

    expect(screen.getByTestId('test-entries-list')).toBeInTheDocument();
    expect(screen.getByText('Date Header')).toBeInTheDocument();
    expect(screen.getByText('Row 1')).toBeInTheDocument();
    expect(screen.getByTestId('mobile-card-1')).toBeInTheDocument();
  });
});
