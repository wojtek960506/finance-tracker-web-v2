import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

import { resendVerification, verifyEmail } from '@auth/api';
import { AuthFormShell } from '@auth/components/auth-form-shell';
import { normalizeApiError } from '@shared/api/api-error';
import { MAIN_BUTTON_TEXT } from '@shared/consts';
import { Button, ButtonLink, Input, Label, LoadingState } from '@ui';

type VerificationStatus = 'loading' | 'success' | 'expired' | 'invalid';

const getVerificationStatus = (errorCode?: string): VerificationStatus => {
  if (errorCode === 'AUTH_EXPIRED_EMAIL_VERIFICATION_TOKEN') return 'expired';
  return 'invalid';
};

// TODO revisit this screen:
// - split success, failure, resend, and resend-success views into smaller components
// - simplify the local state transitions around invalid/expired/resend flows
// - consider extracting verification/resend logic into a dedicated hook or state machine
export const VerifyEmail = () => {
  const { t } = useTranslation('auth');
  const { t: tAuthErrors } = useTranslation('auth-errors');
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token')?.trim();
  const [status, setStatus] = useState<VerificationStatus>(token ? 'loading' : 'invalid');
  const [email, setEmail] = useState('');
  const [isResendPending, setIsResendPending] = useState(false);
  const [didResendVerification, setDidResendVerification] = useState(false);
  const [isInvalidResendVisible, setIsInvalidResendVisible] = useState(false);
  const normalizedEmail = email.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isInvalidEmail = normalizedEmail !== '' && !emailRegex.test(normalizedEmail);

  useEffect(() => {
    if (!token) return;

    let isMounted = true;

    const runVerification = async () => {
      try {
        await verifyEmail({ token });

        if (isMounted) setStatus('success');
      } catch (error) {
        const apiError = normalizeApiError(error);

        if (isMounted) {
          const nextStatus = getVerificationStatus(apiError.code);
          setStatus(nextStatus);
        }
      }
    };

    void runVerification();

    return () => {
      isMounted = false;
    };
  }, [token]);

  if (status === 'loading') {
    return (
      <div className="h-full flex justify-center items-center">
        <LoadingState
          title={t('verifyEmailLoadingTitle')}
          description={t('verifyEmailLoadingDescription')}
          className="max-w-sm"
        />
      </div>
    );
  }

  if (didResendVerification) {
    return (
      <AuthFormShell className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-2xl font-bold sm:text-3xl">
            {t('resendVerificationSuccessTitle')}
          </h1>
          <p className="text-sm text-text-muted sm:text-base">
            {t('resendVerificationSuccess')}
          </p>
        </div>

        <ButtonLink
          to="/login"
          variant="primary"
          className={clsx('py-1 sm:py-2', MAIN_BUTTON_TEXT)}
        >
          {t('backToLogin')}
        </ButtonLink>
      </AuthFormShell>
    );
  }

  const isSuccess = status === 'success';
  const description =
    status === 'expired'
      ? tAuthErrors('AUTH_EXPIRED_EMAIL_VERIFICATION_TOKEN')
      : status === 'invalid'
        ? tAuthErrors('AUTH_INVALID_EMAIL_VERIFICATION_TOKEN')
        : t('verifyEmailSuccessDescription');

  const canResendFromCurrentState = status === 'expired' || isInvalidResendVisible;
  const showResendTitle = canResendFromCurrentState && !didResendVerification;
  const title = showResendTitle
    ? t('resendVerificationTitle')
    : isSuccess
      ? t('verifyEmailSuccessTitle')
      : t('verifyEmailErrorTitle');
  const visibleDescription = showResendTitle
    ? t('resendVerificationDescription')
    : description;

  const handleResendVerification = async () => {
    if (
      !canResendFromCurrentState ||
      isInvalidEmail ||
      normalizedEmail === '' ||
      isResendPending
    ) {
      return;
    }

    try {
      setIsResendPending(true);
      await resendVerification({ email: normalizedEmail });
      setDidResendVerification(true);
    } finally {
      setIsResendPending(false);
    }
  };

  return (
    <AuthFormShell className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>
        <p className="text-sm text-text-muted sm:text-base">{visibleDescription}</p>
      </div>

      {status === 'invalid' && !isInvalidResendVisible ? (
        <Button
          type="button"
          variant="ghost"
          onClick={() => setIsInvalidResendVisible(true)}
          className={MAIN_BUTTON_TEXT}
        >
          {t('needAnotherVerificationEmail')}
        </Button>
      ) : null}

      {canResendFromCurrentState ? (
        <div className="flex flex-col gap-2">
          <Label>
            <span className="text-lg sm:text-xl font-bold">{t('email')}</span>
            <Input
              id="resendVerificationEmail"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              placeholder={t('emailPlaceholder')}
              autoComplete="off"
            />
          </Label>
          <p className="text-destructive text-xs sm:text-sm h-4 sm:h-5 my-1">
            {isInvalidEmail ? t('invalidEmailFormat') : ''}
          </p>
          <Button
            type="button"
            variant="default"
            onClick={() => void handleResendVerification()}
            disabled={normalizedEmail === '' || isInvalidEmail || isResendPending}
            className={MAIN_BUTTON_TEXT}
          >
            {t('resendVerificationEmail')}
          </Button>
        </div>
      ) : null}

      <ButtonLink
        to="/login"
        variant={isSuccess ? 'primary' : 'outline'}
        className={clsx('py-1 sm:py-2', MAIN_BUTTON_TEXT)}
      >
        {t('backToLogin')}
      </ButtonLink>
    </AuthFormShell>
  );
};
