import '@shared/i18n';

import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { SpendingCostCell, SpendingCostRow } from './spending-cost-cell';

describe('SpendingCostCell & SpendingCostRow', () => {
  it('renders cost and unlinked badge in table cell', () => {
    render(
      <MemoryRouter>
        <table>
          <tbody>
            <tr>
              <SpendingCostCell costPln={150.5} transactionId={null} />
            </tr>
          </tbody>
        </table>
      </MemoryRouter>,
    );

    expect(screen.getByText('150.50 PLN')).toBeInTheDocument();
    expect(screen.getByTestId('unlinked-transaction-badge')).toBeInTheDocument();
  });

  it('renders cost and linked badge with link to transaction in table cell', () => {
    render(
      <MemoryRouter>
        <table>
          <tbody>
            <tr>
              <SpendingCostCell costPln={299} transactionId="tx-123" />
            </tr>
          </tbody>
        </table>
      </MemoryRouter>,
    );

    expect(screen.getByText('299.00 PLN')).toBeInTheDocument();
    const linkBadge = screen.getByTestId('linked-transaction-badge');
    expect(linkBadge).toBeInTheDocument();
    expect(linkBadge).toHaveAttribute('href', '/transactions/tx-123');
  });

  it('renders mobile cost row with label and badge', () => {
    render(
      <MemoryRouter>
        <SpendingCostRow label="Total Cost" costPln={45} transactionId="tx-456" />
      </MemoryRouter>,
    );

    expect(screen.getByText('Total Cost')).toBeInTheDocument();
    expect(screen.getByText('45.00 PLN')).toBeInTheDocument();
    expect(screen.getByTestId('linked-transaction-badge')).toBeInTheDocument();
  });
});
