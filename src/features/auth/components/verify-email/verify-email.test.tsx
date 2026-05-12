import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { VerifyEmail } from './verify-email';

const mocks = vi.hoisted(() => ({
  verifyEmail: vi.fn(),
  resendVerification: vi.fn(),
  normalizeApiError: vi.fn(),
}));

vi.mock('@auth/api', () => ({
  verifyEmail: (...args: unknown[]) => mocks.verifyEmail(...args),
  resendVerification: (...args: unknown[]) => mocks.resendVerification(...args),
}));

vi.mock('@shared/api/api-error', () => ({
  normalizeApiError: (error: unknown) => mocks.normalizeApiError(error),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('VerifyEmail', () => {
  const renderVerifyEmail = (initialEntries = ['/verify-email?token=token-123']) =>
    render(
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/login" element={<div>login-page</div>} />
        </Routes>
      </MemoryRouter>,
    );

  beforeEach(() => {
    vi.clearAllMocks();
    mocks.normalizeApiError.mockImplementation((error) => error);
  });

  it('submits the token from query params on page load', async () => {
    mocks.verifyEmail.mockResolvedValueOnce(undefined);

    renderVerifyEmail();

    expect(screen.getByText('verifyEmailLoadingTitle')).toBeInTheDocument();

    await waitFor(() => {
      expect(mocks.verifyEmail).toHaveBeenCalledWith({ token: 'token-123' });
    });

    expect(screen.getByText('verifyEmailSuccessTitle')).toBeInTheDocument();
    expect(screen.getByText('verifyEmailSuccessDescription')).toBeInTheDocument();
  });

  it('shows expired state for expired verification token errors', async () => {
    mocks.verifyEmail.mockRejectedValueOnce(new Error('expired'));
    mocks.normalizeApiError.mockReturnValueOnce({
      code: 'AUTH_EXPIRED_EMAIL_VERIFICATION_TOKEN',
    });

    renderVerifyEmail();

    await waitFor(() => {
      expect(screen.getByText('resendVerificationTitle')).toBeInTheDocument();
    });

    expect(screen.getByText('resendVerificationDescription')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'resendVerificationEmail' }),
    ).toBeInTheDocument();
  });

  it('shows invalid state for invalid verification token errors', async () => {
    mocks.verifyEmail.mockRejectedValueOnce(new Error('invalid'));
    mocks.normalizeApiError.mockReturnValueOnce({
      code: 'AUTH_INVALID_EMAIL_VERIFICATION_TOKEN',
    });

    renderVerifyEmail();

    await waitFor(() => {
      expect(screen.getByText('verifyEmailErrorTitle')).toBeInTheDocument();
    });

    expect(screen.getByText('AUTH_INVALID_EMAIL_VERIFICATION_TOKEN')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'needAnotherVerificationEmail' }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'resendVerificationEmail' }),
    ).not.toBeInTheDocument();
  });

  it('treats missing tokens as invalid without calling the API', async () => {
    renderVerifyEmail(['/verify-email']);

    await waitFor(() => {
      expect(screen.getByText('verifyEmailErrorTitle')).toBeInTheDocument();
    });

    expect(mocks.verifyEmail).not.toHaveBeenCalled();
    expect(screen.getByText('AUTH_INVALID_EMAIL_VERIFICATION_TOKEN')).toBeInTheDocument();
  });

  it('renders a link back to login', async () => {
    mocks.verifyEmail.mockResolvedValueOnce(undefined);

    renderVerifyEmail();

    const backToLoginLink = await screen.findByRole('link', { name: 'backToLogin' });

    expect(backToLoginLink).toHaveAttribute('href', '/login');
  });

  it('resends verification email from the expired token state', async () => {
    const user = userEvent.setup();

    mocks.verifyEmail.mockRejectedValueOnce(new Error('expired'));
    mocks.normalizeApiError.mockReturnValueOnce({
      code: 'AUTH_EXPIRED_EMAIL_VERIFICATION_TOKEN',
    });
    mocks.resendVerification.mockResolvedValueOnce(undefined);

    renderVerifyEmail();

    await screen.findByText('resendVerificationTitle');

    await user.type(screen.getByLabelText('email'), 'expired@example.com');
    await user.click(screen.getByRole('button', { name: 'resendVerificationEmail' }));

    await waitFor(() => {
      expect(mocks.resendVerification).toHaveBeenCalledWith({
        email: 'expired@example.com',
      });
    });

    expect(screen.getByText('resendVerificationSuccessTitle')).toBeInTheDocument();
    expect(screen.getByText('resendVerificationSuccess')).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'resendVerificationEmail' }),
    ).not.toBeInTheDocument();
  });

  it('reveals resend verification form for invalid token state on demand', async () => {
    const user = userEvent.setup();

    mocks.verifyEmail.mockRejectedValueOnce(new Error('invalid'));
    mocks.normalizeApiError.mockReturnValueOnce({
      code: 'AUTH_INVALID_EMAIL_VERIFICATION_TOKEN',
    });

    renderVerifyEmail();

    await screen.findByText('AUTH_INVALID_EMAIL_VERIFICATION_TOKEN');

    await user.click(screen.getByRole('button', { name: 'needAnotherVerificationEmail' }));

    expect(screen.getByText('resendVerificationTitle')).toBeInTheDocument();
    expect(screen.getByText('resendVerificationDescription')).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'needAnotherVerificationEmail' }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'resendVerificationEmail' })).toBeInTheDocument();
    expect(screen.getByLabelText('email')).toBeInTheDocument();
  });

  it('resends verification email from the revealed invalid token form', async () => {
    const user = userEvent.setup();

    mocks.verifyEmail.mockRejectedValueOnce(new Error('invalid'));
    mocks.normalizeApiError.mockReturnValueOnce({
      code: 'AUTH_INVALID_EMAIL_VERIFICATION_TOKEN',
    });
    mocks.resendVerification.mockResolvedValueOnce(undefined);

    renderVerifyEmail();

    await screen.findByText('AUTH_INVALID_EMAIL_VERIFICATION_TOKEN');
    await user.click(screen.getByRole('button', { name: 'needAnotherVerificationEmail' }));
    await user.type(screen.getByLabelText('email'), 'invalid@example.com');
    await user.click(screen.getByRole('button', { name: 'resendVerificationEmail' }));

    await waitFor(() => {
      expect(mocks.resendVerification).toHaveBeenCalledWith({
        email: 'invalid@example.com',
      });
    });

    expect(screen.getByText('resendVerificationSuccessTitle')).toBeInTheDocument();
    expect(screen.getByText('resendVerificationSuccess')).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'resendVerificationEmail' }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'backToLogin' })).toHaveAttribute(
      'href',
      '/login',
    );
  });
});
