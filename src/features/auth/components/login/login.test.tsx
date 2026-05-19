import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Login } from './login';

const mocks = vi.hoisted(() => ({
  login: vi.fn(),
  resendVerification: vi.fn(),
  normalizeApiError: vi.fn(),
  setAuthToken: vi.fn(),
  pushToast: vi.fn(),
}));

vi.mock('@auth/api', () => ({
  login: (...args: unknown[]) => mocks.login(...args),
  resendVerification: (...args: unknown[]) => mocks.resendVerification(...args),
}));

vi.mock('@shared/api/api-error', () => ({
  normalizeApiError: (error: unknown) => mocks.normalizeApiError(error),
}));

vi.mock('@shared/hooks', () => ({
  useAuthToken: () => ({ setAuthToken: mocks.setAuthToken }),
}));

vi.mock('@store/toast-store', () => ({
  useToastStore: (selector: (state: { pushToast: typeof mocks.pushToast }) => unknown) =>
    selector({ pushToast: mocks.pushToast }),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
  Trans: ({ i18nKey, values }: { i18nKey: string; values?: { email?: string } }) =>
    `${i18nKey}:${values?.email ?? ''}`,
}));

describe('Login', () => {
  const renderLogin = (initialEntries = ['/login']) =>
    render(
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          <Route path="/login" element={<Login />} />
        </Routes>
      </MemoryRouter>,
    );

  beforeEach(() => {
    vi.clearAllMocks();
    mocks.normalizeApiError.mockImplementation((error) => error);
  });

  it('renders empty initial values and disabled submit button', () => {
    renderLogin();

    const emailInput = screen.getByLabelText('email') as HTMLInputElement;
    const passwordInput = screen.getByLabelText('password') as HTMLInputElement;
    const submitButton = screen.getByRole('button', { name: 'logIn' });

    expect(emailInput.value).toBe('');
    expect(passwordInput.value).toBe('');
    expect(submitButton).toBeDisabled();
  });

  it('focuses email input on initial render', () => {
    renderLogin();

    expect(screen.getByLabelText('email')).toHaveFocus();
  });

  it('shows validation error after email blur and disables submit', async () => {
    const user = userEvent.setup();

    renderLogin();

    const emailInput = screen.getByLabelText('email') as HTMLInputElement;
    const submitButton = screen.getByRole('button', { name: 'logIn' });

    await user.clear(emailInput);
    await user.type(emailInput, 'invalid');
    await user.tab();

    expect(screen.getByText('invalidEmailFormat')).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });

  it('does not flash email validation when navigating to create account', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<div>register-page</div>} />
        </Routes>
      </MemoryRouter>,
    );

    await user.type(screen.getByLabelText('email'), 'invalid');
    await user.click(screen.getByRole('link', { name: 'goToCreateAccount' }));

    expect(screen.getByText('register-page')).toBeInTheDocument();
    expect(screen.queryByText('invalidEmailFormat')).not.toBeInTheDocument();
  });

  it('prevents submit and shows error for invalid email', async () => {
    const user = userEvent.setup();

    renderLogin();

    const emailInput = screen.getByLabelText('email') as HTMLInputElement;
    const submitButton = screen.getByRole('button', { name: 'logIn' });

    await user.clear(emailInput);
    await user.type(emailInput, 'invalid');
    await user.click(submitButton);

    expect(mocks.login).not.toHaveBeenCalled();
    expect(screen.getByText('invalidEmailFormat')).toBeInTheDocument();
  });

  it('submits credentials and resets form on success', async () => {
    const user = userEvent.setup();
    mocks.login.mockResolvedValueOnce('token-123');

    renderLogin();

    const emailInput = screen.getByLabelText('email') as HTMLInputElement;
    const passwordInput = screen.getByLabelText('password') as HTMLInputElement;
    const submitButton = screen.getByRole('button', { name: 'logIn' });

    await user.clear(emailInput);
    await user.type(emailInput, 'test@example.com');
    await user.clear(passwordInput);
    await user.type(passwordInput, 'secret');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mocks.login).toHaveBeenCalledWith('test@example.com', 'secret');
      expect(mocks.setAuthToken).toHaveBeenCalledWith('token-123', {
        broadcast: true,
      });
    });

    expect(emailInput.value).toBe('');
    expect(passwordInput.value).toBe('');
    expect(submitButton).toBeDisabled();
  });

  it('shows a translated toast when login fails', async () => {
    const user = userEvent.setup();
    const error = new Error('boom');

    mocks.login.mockRejectedValueOnce(error);
    mocks.normalizeApiError.mockReturnValueOnce({
      code: 'UNAUTHORIZED_INVALID_CREDENTIALS_ERROR',
      message: 'boom',
    });

    renderLogin();

    await user.type(screen.getByLabelText('email'), 'user@example.com');
    await user.type(screen.getByLabelText('password'), 'secret');

    const submitButton = screen.getByRole('button', { name: 'logIn' });

    await user.click(submitButton);

    await waitFor(() => {
      expect(mocks.pushToast).toHaveBeenCalledWith({
        variant: 'error',
        message: 'UNAUTHORIZED_INVALID_CREDENTIALS_ERROR',
      });
    });

    expect(mocks.setAuthToken).not.toHaveBeenCalled();
  });

  it('includes the entered email in the user-not-found toast message', async () => {
    const user = userEvent.setup();

    mocks.login.mockRejectedValueOnce(new Error('boom'));
    mocks.normalizeApiError.mockReturnValueOnce({
      code: 'UNAUTHORIZED_USER_NOT_FOUND_ERROR',
      message: 'boom',
    });

    renderLogin();

    await user.type(screen.getByLabelText('email'), 'missing@example.com');
    await user.type(screen.getByLabelText('password'), 'secret');
    await user.click(screen.getByRole('button', { name: 'logIn' }));

    await waitFor(() => {
      const toast = mocks.pushToast.mock.calls.at(-1)?.[0];

      expect(toast?.variant).toBe('error');
      expect(toast?.message).toBeTruthy();
    });

    const toast = mocks.pushToast.mock.calls.at(-1)?.[0];
    const { container } = render(<>{toast?.message}</>);
    expect(container).toHaveTextContent(
      'UNAUTHORIZED_USER_NOT_FOUND_ERROR:missing@example.com',
    );
  });

  it('shows a raw api error message in toast when there is no error code', async () => {
    const user = userEvent.setup();

    mocks.login.mockRejectedValueOnce(new Error('boom'));
    mocks.normalizeApiError.mockReturnValueOnce({
      message: 'Temporary auth outage',
    });

    renderLogin();

    await user.type(screen.getByLabelText('email'), 'user@example.com');
    await user.type(screen.getByLabelText('password'), 'secret');

    await user.click(screen.getByRole('button', { name: 'logIn' }));

    await waitFor(() => {
      expect(mocks.pushToast).toHaveBeenCalledWith({
        variant: 'error',
        message: 'Temporary auth outage',
      });
    });
  });

  it('shows resend verification action for unverified email login errors', async () => {
    const user = userEvent.setup();

    mocks.login.mockRejectedValueOnce(new Error('boom'));
    mocks.normalizeApiError.mockReturnValueOnce({
      code: 'AUTH_EMAIL_NOT_VERIFIED',
      message: 'boom',
    });

    renderLogin();

    await user.type(screen.getByLabelText('email'), 'pending@example.com');
    await user.type(screen.getByLabelText('password'), 'secret');
    await user.click(screen.getByRole('button', { name: 'logIn' }));

    await waitFor(() => {
      expect(screen.getByText('loginVerificationRequiredTitle')).toBeInTheDocument();
    });

    expect(screen.getByText('AUTH_EMAIL_NOT_VERIFIED')).toBeInTheDocument();
    expect(screen.getByText('pending@example.com')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'resendVerificationEmail' }),
    ).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'logIn' })).not.toBeInTheDocument();
    expect(mocks.pushToast).not.toHaveBeenCalled();
  });

  it('resends verification email from unverified login state', async () => {
    const user = userEvent.setup();

    mocks.login.mockRejectedValueOnce(new Error('boom'));
    mocks.normalizeApiError.mockReturnValueOnce({
      code: 'AUTH_EMAIL_NOT_VERIFIED',
      message: 'boom',
    });
    mocks.resendVerification.mockResolvedValueOnce(undefined);

    renderLogin();

    await user.type(screen.getByLabelText('email'), 'pending@example.com');
    await user.type(screen.getByLabelText('password'), 'secret');
    await user.click(screen.getByRole('button', { name: 'logIn' }));

    const resendButton = await screen.findByRole('button', {
      name: 'resendVerificationEmail',
    });
    await user.click(resendButton);

    await waitFor(() => {
      expect(mocks.resendVerification).toHaveBeenCalledWith({
        email: 'pending@example.com',
      });
    });

    expect(screen.getByText('resendVerificationSuccessTitle')).toBeInTheDocument();
    expect(screen.getByText('resendVerificationSuccess')).toBeInTheDocument();
    expect(screen.queryByText('pending@example.com')).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'resendVerificationEmail' }),
    ).not.toBeInTheDocument();
  });

  it('lets the user return to the login form from unverified email state', async () => {
    const user = userEvent.setup();

    mocks.login.mockRejectedValueOnce(new Error('boom'));
    mocks.normalizeApiError.mockReturnValueOnce({
      code: 'AUTH_EMAIL_NOT_VERIFIED',
      message: 'boom',
    });

    renderLogin();

    await user.type(screen.getByLabelText('email'), 'pending@example.com');
    await user.type(screen.getByLabelText('password'), 'secret');
    await user.click(screen.getByRole('button', { name: 'logIn' }));

    await screen.findByText('loginVerificationRequiredTitle');
    await user.click(screen.getByRole('button', { name: 'backToSignIn' }));

    expect(screen.getByRole('button', { name: 'logIn' })).toBeInTheDocument();
    expect(screen.getByLabelText('email')).toHaveValue('pending@example.com');
  });

  it('prefills email from query params after registration redirect', () => {
    renderLogin(['/login?email=new.user%40example.com']);

    const emailInput = screen.getByLabelText('email') as HTMLInputElement;
    const passwordInput = screen.getByLabelText('password') as HTMLInputElement;

    expect(emailInput.value).toBe('new.user@example.com');
    expect(passwordInput.value).toBe('');
  });

  it('renders link to create an account', () => {
    renderLogin();

    expect(screen.getByRole('link', { name: 'goToCreateAccount' })).toHaveAttribute(
      'href',
      '/register',
    );
  });
});
