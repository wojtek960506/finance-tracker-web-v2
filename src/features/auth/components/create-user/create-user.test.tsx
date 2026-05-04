import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { CreateUser } from './create-user';

const mocks = vi.hoisted(() => ({
  createUser: vi.fn(),
  normalizeApiError: vi.fn(),
  pushToast: vi.fn(),
}));

vi.mock('@auth/api', () => ({
  createUser: (...args: unknown[]) => mocks.createUser(...args),
}));

vi.mock('@shared/api/api-error', () => ({
  normalizeApiError: (error: unknown) => mocks.normalizeApiError(error),
}));

vi.mock('@store/toast-store', () => ({
  useToastStore: (selector: (state: { pushToast: typeof mocks.pushToast }) => unknown) =>
    selector({ pushToast: mocks.pushToast }),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('CreateUser', () => {
  const renderCreateUser = () =>
    render(
      <QueryClientProvider
        client={
          new QueryClient({
            defaultOptions: {
              queries: { retry: false },
              mutations: { retry: false },
            },
          })
        }
      >
        <MemoryRouter initialEntries={['/register']}>
          <CreateUser />
        </MemoryRouter>
      </QueryClientProvider>,
    );

  beforeEach(() => {
    vi.clearAllMocks();
    mocks.normalizeApiError.mockImplementation((error) => error);
  });

  it('focuses first name input on initial render', async () => {
    renderCreateUser();

    await waitFor(() => {
      expect(screen.getByLabelText('firstName')).toHaveFocus();
    });
  });

  it('shows validation errors and disables submit for invalid values', async () => {
    const user = userEvent.setup();

    renderCreateUser();

    const firstNameInput = screen.getByLabelText('firstName');
    const emailInput = screen.getByLabelText('email');
    const passwordInput = screen.getByLabelText('password');
    const confirmPasswordInput = screen.getByLabelText('confirmPassword');
    const submitButton = screen.getByRole('button', { name: 'createAccount' });

    await user.type(firstNameInput, 'J');
    await user.tab();
    await user.type(emailInput, 'invalid');
    await user.tab();
    await user.type(passwordInput, '12');
    await user.tab();
    await user.type(confirmPasswordInput, '13');
    await user.tab();

    expect(screen.getByText('firstNameTooShort')).toBeInTheDocument();
    expect(screen.getByText('invalidEmailFormat')).toBeInTheDocument();
    expect(screen.getByText('passwordTooShort')).toBeInTheDocument();
    expect(screen.getByText('passwordsDoNotMatch')).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });

  it('creates a user and shows verification instructions instead of redirecting', async () => {
    const user = userEvent.setup();

    renderCreateUser();

    await user.type(screen.getByLabelText('firstName'), 'John');
    await user.type(screen.getByLabelText('lastName'), 'Doe');
    await user.type(screen.getByLabelText('email'), 'john@example.com');
    await user.type(screen.getByLabelText('password'), 'secret');
    await user.type(screen.getByLabelText('confirmPassword'), 'secret');
    await user.click(screen.getByRole('button', { name: 'createAccount' }));

    await waitFor(() => {
      expect(mocks.createUser).toHaveBeenCalledWith({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'secret',
      });
    });

    expect(mocks.pushToast).not.toHaveBeenCalled();

    expect(screen.getByText('registrationSuccessTitle')).toBeInTheDocument();
    expect(screen.getByText('registrationSuccessDescription')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'backToLogin' })).toHaveAttribute(
      'href',
      '/login',
    );
  });

  it('shows translated user creation errors in a toast and stays on the page', async () => {
    const user = userEvent.setup();

    mocks.createUser.mockRejectedValueOnce(new Error('duplicate'));
    mocks.normalizeApiError.mockReturnValueOnce({
      code: 'USER_EMAIL_ALREADY_EXISTS',
      message: 'duplicate',
    });

    renderCreateUser();

    await user.type(screen.getByLabelText('firstName'), 'John');
    await user.type(screen.getByLabelText('lastName'), 'Doe');
    await user.type(screen.getByLabelText('email'), 'john@example.com');
    await user.type(screen.getByLabelText('password'), 'secret');
    await user.type(screen.getByLabelText('confirmPassword'), 'secret');
    await user.click(screen.getByRole('button', { name: 'createAccount' }));

    await waitFor(() => {
      expect(mocks.pushToast).toHaveBeenCalledWith({
        variant: 'error',
        title: 'createAccountFailed',
        message: 'USER_EMAIL_ALREADY_EXISTS',
      });
    });

    expect(screen.getByRole('button', { name: 'createAccount' })).toBeInTheDocument();
    expect(screen.queryByText('registrationSuccessTitle')).not.toBeInTheDocument();
  });

  it('shows raw api error message in a toast when there is no error code', async () => {
    const user = userEvent.setup();

    mocks.createUser.mockRejectedValueOnce(new Error('duplicate'));
    mocks.normalizeApiError.mockReturnValueOnce({
      message: 'Could not create user right now',
    });

    renderCreateUser();

    await user.type(screen.getByLabelText('firstName'), 'John');
    await user.type(screen.getByLabelText('lastName'), 'Doe');
    await user.type(screen.getByLabelText('email'), 'john@example.com');
    await user.type(screen.getByLabelText('password'), 'secret');
    await user.type(screen.getByLabelText('confirmPassword'), 'secret');
    await user.click(screen.getByRole('button', { name: 'createAccount' }));

    await waitFor(() => {
      expect(mocks.pushToast).toHaveBeenCalledWith({
        variant: 'error',
        title: 'createAccountFailed',
        message: 'Could not create user right now',
      });
    });
  });

  it('trims submitted values before creating a user', async () => {
    const user = userEvent.setup();

    renderCreateUser();

    await user.type(screen.getByLabelText('firstName'), '  John  ');
    await user.type(screen.getByLabelText('lastName'), '  Doe  ');
    await user.type(screen.getByLabelText('email'), '  john@example.com  ');
    await user.type(screen.getByLabelText('password'), 'secret');
    await user.type(screen.getByLabelText('confirmPassword'), 'secret');
    await user.click(screen.getByRole('button', { name: 'createAccount' }));

    await waitFor(() => {
      expect(mocks.createUser).toHaveBeenCalledWith({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'secret',
      });
    });
  });

  it('renders link back to login', () => {
    renderCreateUser();

    expect(screen.getByRole('link', { name: 'backToLogin' })).toHaveAttribute(
      'href',
      '/login',
    );
  });
});
