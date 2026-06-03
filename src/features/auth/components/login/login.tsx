import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { login } from '@auth/api';
import { useAuthToken } from '@shared/hooks';

import type { LoginFormValues } from './login-form/utils/utils';
import { LoginForm } from './login-form';
import { UnverifiedUser } from './unverified-user';
import { useCatchLoginError } from './use-catch-login-error';

export const Login = () => {
  const emailInputRef = useRef<HTMLInputElement>(null);
  const [searchParams] = useSearchParams();
  const redirectedEmail = searchParams.get('email') ?? '';

  const [isLoginPending, setIsLoginPending] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);

  const { setAuthToken } = useAuthToken();
  const catchLoginError = useCatchLoginError(setUnverifiedEmail);

  useEffect(() => {
    if (unverifiedEmail) return;
    emailInputRef.current?.focus();
  }, [unverifiedEmail]);

  const handleSubmit = async ({ email, password }: LoginFormValues) => {
    try {
      setIsLoginPending(true);
      const res = await login(email, password);
      setAuthToken(res, { broadcast: true });
    } catch (error) {
      catchLoginError(error, email);
    } finally {
      setIsLoginPending(false);
    }
  };

  if (unverifiedEmail) {
    return (
      <UnverifiedUser
        unverifiedEmail={unverifiedEmail}
        resetUnverifiedEmail={() => setUnverifiedEmail(null)}
      />
    );
  }
  return (
    <LoginForm
      redirectedEmail={redirectedEmail}
      isPending={isLoginPending}
      onSubmit={handleSubmit}
    />
  );
};
