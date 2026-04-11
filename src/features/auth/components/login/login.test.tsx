import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Login } from './login';

const mocks = vi.hoisted(() => ({
  login: vi.fn(),
  normalizeApiError: vi.fn(),
  setAuthToken: vi.fn(),
}));

vi.mock('@auth/api', () => ({
  login: (...args: unknown[]) => mocks.login(...args),
}));

vi.mock('@shared/api/api-error', () => ({
  normalizeApiError: (error: unknown) => mocks.normalizeApiError(error),
}));

vi.mock('@shared/hooks', () => ({
  useAuthToken: () => ({ setAuthToken: mocks.setAuthToken }),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
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

  it('renders initial values and enabled submit button', () => {
    renderLogin();

    const emailInput = screen.getByLabelText('email') as HTMLInputElement;
    const passwordInput = screen.getByLabelText('password') as HTMLInputElement;
    const submitButton = screen.getByRole('button', { name: 'logIn' });

    expect(emailInput.value).toBe('w@z.pl');
    expect(passwordInput.value).toBe('123');
    expect(submitButton).toBeEnabled();
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
      expect(mocks.setAuthToken).toHaveBeenCalledWith('token-123');
    });

    expect(emailInput.value).toBe('');
    expect(passwordInput.value).toBe('');
    expect(submitButton).toBeDisabled();
  });

  it('alerts when login fails', async () => {
    const user = userEvent.setup();
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    const error = new Error('boom');

    mocks.login.mockRejectedValueOnce(error);
    mocks.normalizeApiError.mockReturnValueOnce({
      code: 'UNAUTHORIZED_INVALID_CREDENTIALS_ERROR',
      message: 'boom',
    });

    renderLogin();

    const submitButton = screen.getByRole('button', { name: 'logIn' });

    await user.click(submitButton);

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('UNAUTHORIZED_INVALID_CREDENTIALS_ERROR');
    });

    expect(mocks.setAuthToken).not.toHaveBeenCalled();
    alertSpy.mockRestore();
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
