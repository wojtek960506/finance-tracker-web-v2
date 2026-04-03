import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactElement } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { NavigationItem } from './navigation-item';

const mocks = vi.hoisted(() => ({
  setIsNavOpen: vi.fn(),
  fromLeft: { value: true },
}));

vi.mock('@store/ui-store', () => ({
  useUIStore: () => ({
    setIsNavOpen: mocks.setIsNavOpen,
  }),
}));

vi.mock('@context/navigation-context', () => ({
  useNavigation: () => ({ fromLeft: mocks.fromLeft.value }),
}));

const renderNavigationItem = (ui: ReactElement, route = '/') =>
  render(<MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>);

describe('NavigationItem', () => {
  beforeEach(() => {
    mocks.fromLeft.value = true;
    mocks.setIsNavOpen.mockClear();
  });

  it('renders a placeholder icon when Icon is not provided', () => {
    const { container } = renderNavigationItem(
      <NavigationItem to="/home" title="Home" />,
    );

    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
    expect(container.querySelector('a div.w-7.h-7')).toBeInTheDocument();
  });

  it('renders the provided icon', () => {
    const Icon = ({ className }: { className?: string }) => (
      <svg data-testid="icon" className={className} />
    );

    renderNavigationItem(<NavigationItem to="/stats" title="Stats" Icon={Icon} />);

    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('marks the link as current when the route matches', () => {
    renderNavigationItem(<NavigationItem to="/active" title="Active" />, '/active');

    expect(screen.getByRole('link', { name: 'Active' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  it('closes navigation when clicked without an additional action', async () => {
    const user = userEvent.setup();

    renderNavigationItem(<NavigationItem to="/profile" title="Profile" />);

    await user.click(screen.getByRole('link', { name: 'Profile' }));

    expect(mocks.setIsNavOpen).toHaveBeenCalledWith(false);
  });

  it('closes navigation and calls the additional action on click', async () => {
    const user = userEvent.setup();
    const additionalAction = vi.fn();

    renderNavigationItem(
      <NavigationItem
        to="/settings"
        title="Settings"
        additionalAction={additionalAction}
      />,
    );

    await user.click(screen.getByRole('link', { name: 'Settings' }));

    expect(mocks.setIsNavOpen).toHaveBeenCalledWith(false);
    expect(additionalAction).toHaveBeenCalled();
  });

  it('renders when navigation is from the right', () => {
    mocks.fromLeft.value = false;

    renderNavigationItem(<NavigationItem to="/right" title="Right" />);

    expect(screen.getByRole('link', { name: 'Right' })).toBeInTheDocument();
  });
});
