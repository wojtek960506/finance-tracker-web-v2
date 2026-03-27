import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Label } from './label';

describe('Label', () => {
  it('renders children and merges className', () => {
    render(
      <Label className="custom-class">
        <span>Username</span>
      </Label>,
    );

    const label = screen.getByText('Username').closest('label');
    expect(label).toBeInTheDocument();
    expect(label).toHaveClass('custom-class');
  });
});
