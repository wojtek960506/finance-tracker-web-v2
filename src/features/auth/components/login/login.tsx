import { useEffect, useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

import { login } from '@auth/api';
import { AuthFormField } from '@auth/components/auth-form-field';
import { AuthFormShell } from '@auth/components/auth-form-shell';
import { normalizeApiError } from '@shared/api/api-error';
import { useAuthToken } from '@shared/hooks';
import { useToastStore } from '@store/toast-store';
import { FIELD_CONTROL_CLASS_NAME } from '@transactions/components/transaction-forms';
import { Input } from '@ui';

import { AuthFormButtons } from '../auth-form-buttons';

import { UnverifiedUser } from './unverified-user';

// TODO revisit this screen:
// - split the sign-in form into smaller component
// - reduce the number of local UI states by extracting the flow into a smaller state model or hook
// - centralize auth error-to-UI mapping so the component does less branching inline

export const Login = () => {
  const { t } = useTranslation('auth');
  const { t: tAuthErrors } = useTranslation('auth-errors');
  const emailInputRef = useRef<HTMLInputElement>(null);
  const [searchParams] = useSearchParams();
  const redirectedEmail = searchParams.get('email') ?? '';

  const [email, setEmail] = useState(redirectedEmail);
  const [password, setPassword] = useState('');

  const [isEmailInputTouched, setIsEmailInputTouched] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoginPending, setIsLoginPending] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const normalizedEmail = email.trim();
  const isInvalidEmail = !emailRegex.test(normalizedEmail);

  const showEmailError = isInvalidEmail && (isEmailInputTouched || isSubmitted);

  const { setAuthToken } = useAuthToken();
  const pushToast = useToastStore((state) => state.pushToast);

  useEffect(() => {
    if (unverifiedEmail) return;
    emailInputRef.current?.focus();
  }, [unverifiedEmail]);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsSubmitted(true);
    if (isInvalidEmail || normalizedEmail === '' || password === '') return;

    try {
      setIsLoginPending(true);
      const res = await login(normalizedEmail, password);
      setAuthToken(res, { broadcast: true });

      // those probably not needed as it will reset during next render
      setIsSubmitted(false);
      setIsEmailInputTouched(false);
      setEmail('');
      setPassword('');
    } catch (error) {
      const apiError = normalizeApiError(error);

      if (apiError.code === 'AUTH_EMAIL_NOT_VERIFIED') {
        setUnverifiedEmail(normalizedEmail);
        return;
      }

      setUnverifiedEmail(null);
      pushToast({
        variant: 'error',
        message:
          apiError.code === 'UNAUTHORIZED_USER_NOT_FOUND_ERROR' ? (
            <Trans
              ns="auth-errors"
              i18nKey={apiError.code}
              values={{ email: normalizedEmail }}
              defaults={apiError.message}
              components={{ strong: <strong className="font-semibold" /> }}
            />
          ) : apiError.code ? (
            tAuthErrors(apiError.code, { defaultValue: apiError.message })
          ) : (
            apiError.message
          ),
      });
    } finally {
      setIsLoginPending(false);
    }
  };

  
  if (unverifiedEmail) {
    return (<UnverifiedUser
      unverifiedEmail={unverifiedEmail}
      resetUnverifiedEmail={() => setUnverifiedEmail(null)}
    />)
  }

  return (
    <AuthFormShell onSubmit={handleSubmit}>
      <AuthFormField label={t('email')} required error={showEmailError ? t('invalidEmailFormat') : undefined}>
        <Input
          ref={emailInputRef}
          id="email"
          value={email}
          onChange={(e) => {
            const nextEmail = e.target.value;
            setEmail(nextEmail);

            if (unverifiedEmail && nextEmail.trim() !== unverifiedEmail) {
              setUnverifiedEmail(null);
            }
          }}
          placeholder={t('emailPlaceholder')}
          onBlur={() => setIsEmailInputTouched(true)}
          autoComplete="off"
          className={FIELD_CONTROL_CLASS_NAME}
        />
      </AuthFormField>

      <AuthFormField label={t('password')} required>
        <Input
          id="password"
          value={password}
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t('passwordPlaceholder')}
          autoComplete="off"
          className={FIELD_CONTROL_CLASS_NAME}
        />
      </AuthFormField>

      <AuthFormButtons
        isPrimaryPending={isLoginPending}
        isPrimaryDisabled={email === '' || password === '' || showEmailError || isLoginPending}
        primaryText={t('logIn')}
        primaryTextPending={t('loggingIn')}
        isSecondaryDisabled={isLoginPending}
        secondaryText={t('goToCreateAccount')}
        secondaryTo='/register'
      />
    </AuthFormShell>
  );
};
