import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Navigation } from './navigation';

const mocks = vi.hoisted(() => ({
  authToken: { value: 'token' as string | null },
  removeAuthToken: vi.fn(),
  isCollapsibleInitiallyOpen: { value: false },
  setIsCollapsibleInitiallyOpen: vi.fn(),
  clear: vi.fn(),
  logout: vi.fn().mockResolvedValue(undefined),
  fromLeft: { value: true },
}));

vi.mock('@shared/hooks', () => ({
  useAuthToken: () => ({
    authToken: mocks.authToken.value,
    removeAuthToken: mocks.removeAuthToken,
  }),
  useLocalStorage: () => ({
    item: mocks.isCollapsibleInitiallyOpen.value,
    setItem: mocks.setIsCollapsibleInitiallyOpen,
  }),
}));

vi.mock('@context/navigation-context', () => ({
  useNavigation: () => ({ fromLeft: mocks.fromLeft.value }),
}));

vi.mock('@tanstack/react-query', () => ({
  useQueryClient: () => ({ clear: mocks.clear }),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock('@auth/api', () => ({
  logout: mocks.logout,
}));

vi.mock('@ui', () => ({
  Collapsible: ({
    header,
    children,
    indicatorPosition,
    isInitiallyOpen,
  }: {
    header: ReactNode;
    children: ReactNode;
    indicatorPosition: 'left' | 'right';
    isInitiallyOpen?: boolean;
  }) => (
    <div
      data-testid="collapsible"
      data-indicator-position={indicatorPosition}
      data-initially-open={String(isInitiallyOpen)}
    >
      <div data-testid="collapsible-header">{header}</div>
      <div data-testid="collapsible-body">{children}</div>
    </div>
  ),
}));

vi.mock('./navigation-item', () => ({
  NavigationItem: ({
    title,
    additionalAction,
    to,
  }: {
    title: string;
    to: string;
    additionalAction?: () => void | Promise<void>;
  }) => (
    <button
      type="button"
      data-to={to}
      onClick={async () => {
        await additionalAction?.();
      }}
    >
      {title}
    </button>
  ),
}));

describe('Navigation', () => {
  beforeEach(() => {
    mocks.authToken.value = 'token';
    mocks.isCollapsibleInitiallyOpen.value = false;
    mocks.fromLeft.value = true;
    vi.clearAllMocks();
  });

  it('renders nothing when the user is not authenticated', () => {
    mocks.authToken.value = null;

    const { container } = render(<Navigation />);

    expect(container).toBeEmptyDOMElement();
  });

  it('uses left indicator position when navigation is from the left', () => {
    render(<Navigation />);

    expect(screen.getByTestId('collapsible')).toHaveAttribute(
      'data-indicator-position',
      'left',
    );
    expect(screen.getByTestId('collapsible')).toHaveAttribute(
      'data-initially-open',
      'false',
    );
  });

  it('passes through initial open state when provided', () => {
    mocks.isCollapsibleInitiallyOpen.value = true;

    render(<Navigation />);

    expect(screen.getByTestId('collapsible')).toHaveAttribute(
      'data-initially-open',
      'true',
    );
  });

  it('uses right indicator position when navigation is from the right', () => {
    mocks.fromLeft.value = false;

    render(<Navigation />);

    expect(screen.getByTestId('collapsible')).toHaveAttribute(
      'data-indicator-position',
      'right',
    );
  });

  it('triggers collapsible actions for each navigation item', async () => {
    const user = userEvent.setup();

    render(<Navigation />);

    await user.click(screen.getByRole('button', { name: 'categories' }));
    await user.click(screen.getByRole('button', { name: 'paymentMethods' }));
    await user.click(screen.getByRole('button', { name: 'bankAccounts' }));
    await user.click(screen.getByRole('button', { name: 'transactionsTrash' }));
    await user.click(screen.getByRole('button', { name: 'vehicles' }));
    await user.click(screen.getByRole('button', { name: 'sports' }));
    await user.click(screen.getByRole('button', { name: 'settings' }));
    await user.click(screen.getByRole('button', { name: 'transactions' }));

    expect(mocks.setIsCollapsibleInitiallyOpen).toHaveBeenCalledTimes(8);
    expect(mocks.setIsCollapsibleInitiallyOpen).toHaveBeenCalledWith(true);
    expect(mocks.setIsCollapsibleInitiallyOpen).toHaveBeenCalledWith(false);
  });

  it('logs out and clears cached data when the logout item is clicked', async () => {
    const user = userEvent.setup();

    render(<Navigation />);

    await user.click(screen.getByRole('button', { name: 'logout' }));

    await waitFor(() => {
      expect(mocks.logout).toHaveBeenCalled();
    });

    expect(mocks.removeAuthToken).toHaveBeenCalled();
    expect(mocks.clear).toHaveBeenCalled();
    expect(mocks.setIsCollapsibleInitiallyOpen).toHaveBeenCalledWith(false);
  });
});
