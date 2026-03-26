import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { HoverLink } from './hover-link';

describe('HoverLink', () => {
  it('renders a link with hover class', () => {
    render(
      <MemoryRouter>
        <HoverLink to="/home">Home</HoverLink>
      </MemoryRouter>,
    );

    const link = screen.getByRole('link', { name: 'Home' });
    expect(link).toHaveAttribute('href', '/home');
    expect(link).toHaveClass('hover:text-active-nav');
  });
});
