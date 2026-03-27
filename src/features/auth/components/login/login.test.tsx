import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Login } from './login';

const mocks = vi.hoisted(() => ({
  login: vi.fn(),
  setAuthToken: vi.fn(),
}));

vi.mock('@auth/api', () => ({
  login: (...args: unknown[]) => mocks.login(...args),
}));

vi.mock('@shared/hooks', () => ({
  useAuthToken: () => ({ setAuthToken: mocks.setAuthToken }),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe('Login', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders initial values and enabled submit button', () => {
    render(<Login />);

    const emailInput = screen.getByLabelText('email') as HTMLInputElement;
    const passwordInput = screen.getByLabelText('password') as HTMLInputElement;
    const submitButton = screen.getByRole('button', { name: 'logIn' });

    expect(emailInput.value).toBe('w@z.pl');
    expect(passwordInput.value).toBe('123');
    expect(submitButton).toBeEnabled();
  });

  it('shows validation error after email blur and disables submit', async () => {
    const user = userEvent.setup();

    render(<Login />);

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

    render(<Login />);

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

    render(<Login />);

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
    const error = new Error('boom');
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    mocks.login.mockRejectedValueOnce(error);

    render(<Login />);

    const submitButton = screen.getByRole('button', { name: 'logIn' });

    await user.click(submitButton);

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith(error);
    });

    expect(mocks.setAuthToken).not.toHaveBeenCalled();
    alertSpy.mockRestore();
  });
});
