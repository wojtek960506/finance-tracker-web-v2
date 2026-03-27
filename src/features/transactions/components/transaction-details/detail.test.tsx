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
});
