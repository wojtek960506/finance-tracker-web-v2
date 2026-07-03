import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

import { login } from '@auth/api';
import { useAuthToken } from '@shared/hooks';

import type { LoginFormValues } from './login-form/utils/utils';
import { LoginForm } from './login-form';
import { UnverifiedUser } from './unverified-user';
import { useCatchLoginError } from './use-catch-login-error';

const AUTH_PAGE_WRAPPER_CLASS = clsx(
  'flex h-full w-full items-center justify-center px-4',
  'bg-gradient-to-br from-[#f7fbe9] via-bg to-[#e7f1c9]',
  'dark:from-[#0d1306] dark:via-bg dark:to-[#182109]',
);
const LOGIN_CONTENT_CLASS = 'flex w-full max-w-[30rem] flex-col gap-12';
const LOGIN_DESCRIPTION_CLASS = clsx(
  'text-[1.75rem] sm:text-[2rem] font-semibold',
  'text-[#6f9228] dark:text-[#98bf41]',
);

export const Login = () => {
  const { t } = useTranslation('auth');
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
      <div className={AUTH_PAGE_WRAPPER_CLASS}>
        <UnverifiedUser
          unverifiedEmail={unverifiedEmail}
          resetUnverifiedEmail={() => setUnverifiedEmail(null)}
        />
      </div>
    );
  }
  return (
    <div className={AUTH_PAGE_WRAPPER_CLASS}>
      <div className={LOGIN_CONTENT_CLASS}>
        <div className="flex flex-col gap-1 text-center">
          <p className={LOGIN_DESCRIPTION_CLASS}>{t('loginDescription')}</p>
        </div>

        <LoginForm
          redirectedEmail={redirectedEmail}
          isPending={isLoginPending}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};
