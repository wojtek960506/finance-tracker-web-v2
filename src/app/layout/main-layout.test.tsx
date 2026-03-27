import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { MainLayout } from './main-layout';

const mocks = vi.hoisted(() => ({
  isNavOpen: { value: true },
  setIsNavOpen: vi.fn(),
}));

vi.mock('@store/ui-store', () => ({
  useUIStore: () => ({
    isNavOpen: mocks.isNavOpen.value,
    setIsNavOpen: mocks.setIsNavOpen,
  }),
}));

vi.mock('@ui', () => ({
  Drawer: ({ isOpen, fromLeft, onClose, children }: any) => (
    <div
      data-testid="drawer"
      data-open={String(isOpen)}
      data-from-left={String(fromLeft)}
    >
      <button type="button" onClick={onClose}>
        Close
      </button>
      {children}
    </div>
  ),
}));

vi.mock('@app/navigation', () => ({
  Navigation: () => <div data-testid="navigation" />,
}));

vi.mock('@context/navigation-context', () => ({
  NavigationProvider: ({ children }: any) => <div>{children}</div>,
}));

vi.mock('./topbar', () => ({
  Topbar: () => <div data-testid="topbar" />,
}));

describe('MainLayout', () => {
  it('renders children and layout controls', () => {
    render(
      <MainLayout>
        <div>Content</div>
      </MainLayout>,
    );

    expect(screen.getByTestId('topbar')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
    expect(screen.getByTestId('drawer')).toHaveAttribute('data-open', 'true');
    expect(screen.getByTestId('navigation')).toBeInTheDocument();
  });

  it('closes the drawer via onClose', async () => {
    const user = userEvent.setup();

    render(
      <MainLayout>
        <div>Content</div>
      </MainLayout>,
    );

    await user.click(screen.getByRole('button', { name: 'Close' }));

    expect(mocks.setIsNavOpen).toHaveBeenCalledWith(false);
  });
});
