import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { ButtonLink } from './button-link';

describe('ButtonLink', () => {
  it('renders a link with a button', () => {
    render(
      <MemoryRouter>
        <ButtonLink to="/settings">Settings</ButtonLink>
      </MemoryRouter>,
    );

    const link = screen.getByRole('link', { name: 'Settings' });
    expect(link).toHaveAttribute('href', '/settings');
  });
});
