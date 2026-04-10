import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Detail } from './detail';

describe('Detail', () => {
  it('renders title and children', () => {
    render(
      <Detail title="Amount">
        <span>123.45 USD</span>
      </Detail>,
    );

    expect(screen.getByText('Amount')).toBeInTheDocument();
    expect(screen.getByText('123.45 USD')).toBeInTheDocument();
  });

  it('supports custom title and value class names', () => {
    render(
      <Detail
        title="Amount"
        titleClassName="text-transaction-expense-label"
        valueClassName="text-destructive"
      >
        <span>123.45 USD</span>
      </Detail>,
    );

    expect(screen.getByText('Amount')).toHaveClass('text-transaction-expense-label');
    expect(screen.getByText('123.45 USD').parentElement).toHaveClass('text-destructive');
  });
});
