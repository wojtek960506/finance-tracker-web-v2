import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Topbar } from './topbar';

vi.mock('./nav-button', () => ({
  NavButton: () => <div data-testid="nav-button" />,
}));

vi.mock('./language-switcher', () => ({
  LanguageSwitcher: () => <div data-testid="language-switcher" />,
}));

vi.mock('./theme-button', () => ({
  ThemeButton: () => <div data-testid="theme-button" />,
}));

vi.mock('./title', () => ({
  Title: () => <div data-testid="title" />,
}));

describe('Topbar', () => {
  it('renders all topbar controls', () => {
    render(<Topbar />);

    expect(screen.getByTestId('nav-button')).toBeInTheDocument();
    expect(screen.getByTestId('title')).toBeInTheDocument();
    expect(screen.getByTestId('language-switcher')).toBeInTheDocument();
    expect(screen.getByTestId('theme-button')).toBeInTheDocument();
  });
});
