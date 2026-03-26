import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { NavButton } from './nav-button';

const mocks = vi.hoisted(() => ({
  isAuthenticated: { value: true },
  setIsNavOpen: vi.fn(),
}));

vi.mock('@shared/hooks', () => ({
  useAuthToken: () => ({ isAuthenticated: mocks.isAuthenticated.value }),
}));

vi.mock('@store/ui-store', () => ({
  useUIStore: () => ({ setIsNavOpen: mocks.setIsNavOpen }),
}));

vi.mock('lucide-react', () => ({
  Menu: (props: { className?: string }) => (
    <svg data-testid="menu-icon" className={props.className} />
  ),
}));

describe('NavButton', () => {
  it('shows button when authenticated', () => {
    mocks.isAuthenticated.value = true;

    render(<NavButton />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('visible');
  });

  it('hides button when unauthenticated', () => {
    mocks.isAuthenticated.value = false;

    render(<NavButton />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('hidden');
  });

  it('opens navigation on click', async () => {
    const user = userEvent.setup();

    render(<NavButton />);

    await user.click(screen.getByRole('button'));

    expect(mocks.setIsNavOpen).toHaveBeenCalledWith(true);
  });
});
