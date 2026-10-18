import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useUIStore } from '@store/ui-store';

import { Navigation } from './navigation';

const mocks = vi.hoisted(() => ({
  authToken: { value: 'token' as string | null },
  removeAuthToken: vi.fn(),
  cancelQueries: vi.fn().mockResolvedValue(undefined),
  clear: vi.fn(),
  logout: vi.fn().mockResolvedValue(undefined),
  fromLeft: { value: true },
  navigate: vi.fn(),
  location: { pathname: '/' },
}));

vi.mock('@shared/hooks', () => ({
  useAuthToken: () => ({
    authToken: mocks.authToken.value,
    removeAuthToken: mocks.removeAuthToken,
  }),
}));

vi.mock('react-router-dom', async () => {
  const actual =
    await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mocks.navigate,
    useLocation: () => mocks.location,
  };
});

vi.mock('@context/navigation-context', () => ({
  useNavigation: () => ({ fromLeft: mocks.fromLeft.value }),
}));

vi.mock('@tanstack/react-query', () => ({
  useQueryClient: () => ({
    cancelQueries: mocks.cancelQueries,
    clear: mocks.clear,
  }),
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
    isOpen,
    onOpenChange,
  }: {
    header: ReactNode;
    children: ReactNode;
    indicatorPosition: 'left' | 'right';
    isOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
  }) => (
    <div
      data-testid="collapsible"
      data-indicator-position={indicatorPosition}
      data-open={String(isOpen)}
    >
      <button
        type="button"
        data-testid="collapsible-toggle"
        onClick={() => onOpenChange?.(!isOpen)}
      >
        toggle
      </button>
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
  const createDeferred = () => {
    let resolve!: () => void;
    const promise = new Promise<void>((res) => {
      resolve = res;
    });

    return { promise, resolve };
  };

  beforeEach(() => {
    mocks.authToken.value = 'token';
    mocks.fromLeft.value = true;
    mocks.location = { pathname: '/' };
    vi.clearAllMocks();
    window.localStorage.clear();
    useUIStore.setState({
      isNavOpen: false,
      isTransactionsTotalsOpen: false,
      isTransactionsFiltersOpen: false,
      expandedTransactionTotalCurrencies: null,
    });
  });

  it('renders nothing when the user is not authenticated', () => {
    mocks.authToken.value = null;

    const { container } = render(<Navigation />);

    expect(container).toBeEmptyDOMElement();
  });

  it('uses left indicator position when navigation is from the left', () => {
    render(<Navigation />);

    const collapsibles = screen.getAllByTestId('collapsible');
    expect(collapsibles).toHaveLength(2);
    expect(collapsibles[0]).toHaveAttribute('data-indicator-position', 'left');
    expect(collapsibles[0]).toHaveAttribute('data-open', 'false');
    expect(collapsibles[1]).toHaveAttribute('data-indicator-position', 'left');
    expect(collapsibles[1]).toHaveAttribute('data-open', 'false');
  });

  it('opens transactions collapsible by default on transactions route', () => {
    mocks.location = { pathname: '/transactions/categories' };

    render(<Navigation />);

    const collapsibles = screen.getAllByTestId('collapsible');
    expect(collapsibles[0]).toHaveAttribute('data-open', 'true');
    expect(collapsibles[1]).toHaveAttribute('data-open', 'false');
  });

  it('opens sports collapsible by default on sports route', () => {
    mocks.location = { pathname: '/sports/categories' };

    render(<Navigation />);

    const collapsibles = screen.getAllByTestId('collapsible');
    expect(collapsibles[0]).toHaveAttribute('data-open', 'false');
    expect(collapsibles[1]).toHaveAttribute('data-open', 'true');
  });

  it('uses right indicator position when navigation is from the right', () => {
    mocks.fromLeft.value = false;

    render(<Navigation />);

    const collapsibles = screen.getAllByTestId('collapsible');
    expect(collapsibles[0]).toHaveAttribute('data-indicator-position', 'right');
    expect(collapsibles[1]).toHaveAttribute('data-indicator-position', 'right');
  });

  it('allows toggling collapsibles via onOpenChange', async () => {
    const user = userEvent.setup();

    render(<Navigation />);

    const toggles = screen.getAllByTestId('collapsible-toggle');
    const collapsibles = screen.getAllByTestId('collapsible');

    expect(collapsibles[0]).toHaveAttribute('data-open', 'false');
    await user.click(toggles[0]);
    expect(collapsibles[0]).toHaveAttribute('data-open', 'true');
  });

  it('logs out and clears cached data when the logout item is clicked', async () => {
    const user = userEvent.setup();
    const deferredLogout = createDeferred();
    mocks.logout.mockReturnValueOnce(deferredLogout.promise);

    render(<Navigation />);

    await user.click(screen.getByRole('button', { name: 'logout' }));

    expect(mocks.cancelQueries).toHaveBeenCalled();
    expect(mocks.removeAuthToken).toHaveBeenCalled();
    expect(mocks.clear).toHaveBeenCalled();
    expect(mocks.navigate).toHaveBeenCalledWith('/login', { replace: true });
    expect(useUIStore.getState().isNavOpen).toBe(false);

    deferredLogout.resolve();

    await waitFor(() => {
      expect(mocks.logout).toHaveBeenCalled();
    });
  });
});
