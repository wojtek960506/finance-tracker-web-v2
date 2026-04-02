import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Card } from './card';

describe('Card', () => {
  it('renders children and merges className', () => {
    const { container } = render(
      <Card className="custom-class">
        <div>Content</div>
      </Card>,
    );

    expect(screen.getByText('Content')).toBeInTheDocument();

    const card = container.firstElementChild;
    expect(card).toBeInTheDocument();
    expect(card).toHaveClass('custom-class');
  });

  it('accepts native div props', () => {
    render(
      <Card role="status" aria-label="Notification">
        <div>Toast</div>
      </Card>,
    );

    expect(screen.getByRole('status', { name: 'Notification' })).toBeInTheDocument();
  });
});
