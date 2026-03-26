import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { ThemeButton } from './theme-button';

const mocks = vi.hoisted(() => ({
  theme: { value: 'light' as 'light' | 'dark' },
  toggleTheme: vi.fn(),
}));

vi.mock('@context/theme-context', () => ({
  useTheme: () => ({ theme: mocks.theme.value, toggleTheme: mocks.toggleTheme }),
}));

vi.mock('lucide-react', () => ({
  Sun: () => <svg data-testid="sun-icon" />,
  Moon: () => <svg data-testid="moon-icon" />,
}));

describe('ThemeButton', () => {
  it('renders moon icon for light theme', () => {
    mocks.theme.value = 'light';

    render(<ThemeButton />);

    expect(screen.getByTestId('moon-icon')).toBeInTheDocument();
  });

  it('renders sun icon for dark theme', () => {
    mocks.theme.value = 'dark';

    render(<ThemeButton />);

    expect(screen.getByTestId('sun-icon')).toBeInTheDocument();
  });

  it('toggles theme on click', async () => {
    const user = userEvent.setup();

    render(<ThemeButton />);

    await user.click(screen.getByRole('button'));

    expect(mocks.toggleTheme).toHaveBeenCalled();
  });
});
