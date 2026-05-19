import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

  it('marks link as disabled when requested', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <ButtonLink to="/settings" disabled>
          Settings
        </ButtonLink>
      </MemoryRouter>,
    );

    const link = screen.getByRole('link', { name: 'Settings' });
    expect(link).toHaveAttribute('aria-disabled', 'true');

    await user.click(link);

    expect(link).toHaveAttribute('href', '/settings');
  });
});
