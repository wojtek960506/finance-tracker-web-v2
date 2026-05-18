import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

import { login, resendVerification } from '@auth/api';
import { AuthFormShell } from '@auth/components/auth-form-shell';
import { normalizeApiError } from '@shared/api/api-error';
import { FORM_BUTTON_SIZE_CLASS } from '@shared/consts';
import { useAuthToken } from '@shared/hooks';
import { useToastStore } from '@store/toast-store';
import { Button, ButtonLink, Input, Label } from '@ui';

// TODO revisit this screen:
// - split the sign-in form and the unverified-email recovery flow into smaller components
// - reduce the number of local UI states by extracting the flow into a smaller state model or hook
// - centralize auth error-to-UI mapping so the component does less branching inline

// unify sizes of buttons and inputs to have similar flow as in transactions
// refactor auth token storing approach - it should be stored just in memory of application
// and not in localStorage - refresh should work well for this approach
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
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);
  const [isResendPending, setIsResendPending] = useState(false);
  const [didResendVerification, setDidResendVerification] = useState(false);

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

  const resetUnverifiedState = () => {
    setUnverifiedEmail(null);
    setDidResendVerification(false);
    setIsResendPending(false);
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsSubmitted(true);
    if (isInvalidEmail || normalizedEmail === '' || password === '') return;

    try {
      const res = await login(normalizedEmail, password);
      setAuthToken(res);

      // those probably not needed as it will reset during next render
      setIsSubmitted(false);
      setIsEmailInputTouched(false);
      resetUnverifiedState();
      setEmail('');
      setPassword('');
    } catch (error) {
      const apiError = normalizeApiError(error);

      if (apiError.code === 'AUTH_EMAIL_NOT_VERIFIED') {
        setUnverifiedEmail(normalizedEmail);
        setDidResendVerification(false);
        return;
      }

      resetUnverifiedState();
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
    }
  };

  const handleResendVerification = async () => {
    if (!unverifiedEmail || isResendPending) return;

    try {
      setIsResendPending(true);
      await resendVerification({ email: unverifiedEmail });
      setDidResendVerification(true);
    } finally {
      setIsResendPending(false);
    }
  };

  const labelCn = 'text-lg sm:text-xl font-bold';

  if (unverifiedEmail) {
    return (
      <AuthFormShell className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-2xl font-bold sm:text-3xl">
            {didResendVerification
              ? t('resendVerificationSuccessTitle')
              : t('loginVerificationRequiredTitle')}
          </h1>
          <p className="text-sm text-text-muted sm:text-base">
            {didResendVerification
              ? t('resendVerificationSuccess')
              : tAuthErrors('AUTH_EMAIL_NOT_VERIFIED')}
          </p>
          {!didResendVerification ? (
            <p className="text-sm font-medium sm:text-base">{unverifiedEmail}</p>
          ) : null}
        </div>

        {!didResendVerification ? (
          <Button
            type="button"
            variant="primary"
            onClick={() => void handleResendVerification()}
            disabled={isResendPending}
            className={clsx(FORM_BUTTON_SIZE_CLASS, 'font-semibold sm:font-bold')}
          >
            {t('resendVerificationEmail')}
          </Button>
        ) : null}

        <Button
          type="button"
          variant={didResendVerification ? 'primary' : 'outline'}
          onClick={resetUnverifiedState}
          className={clsx(FORM_BUTTON_SIZE_CLASS, 'font-semibold sm:font-bold')}
        >
          {t('backToSignIn')}
        </Button>
      </AuthFormShell>
    );
  }

  return (
    <AuthFormShell onSubmit={handleSubmit}>
      <Label>
        <span className={labelCn}>{t('email')}</span>
        <Input
          ref={emailInputRef}
          id="email"
          value={email}
          onChange={(e) => {
            const nextEmail = e.target.value;
            setEmail(nextEmail);

            if (unverifiedEmail && nextEmail.trim() !== unverifiedEmail) {
              setUnverifiedEmail(null);
              setDidResendVerification(false);
            }
          }}
          placeholder={t('emailPlaceholder')}
          onBlur={() => setIsEmailInputTouched(true)}
          autoComplete="off"
        />
      </Label>
      <p className="text-destructive text-xs sm:text-sm h-4 sm:h-5 my-1">
        {showEmailError ? t('invalidEmailFormat') : ''}
      </p>

      <Label>
        <span className={labelCn}>{t('password')}</span>
        <Input
          id="password"
          value={password}
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t('passwordPlaceholder')}
          autoComplete="off"
        />
      </Label>

      <Button
        disabled={email === '' || password === '' || showEmailError}
        type="submit"
        className={clsx('mt-10', FORM_BUTTON_SIZE_CLASS, 'font-semibold sm:font-bold')}
      >
        {t('logIn')}
      </Button>
      <ButtonLink
        to="/register"
        variant="outline"
        className={clsx('mt-2', FORM_BUTTON_SIZE_CLASS, 'font-semibold sm:font-bold')}
      >
        {t('goToCreateAccount')}
      </ButtonLink>
    </AuthFormShell>
  );
};
