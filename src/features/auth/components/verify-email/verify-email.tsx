import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

import { verifyEmail } from '@auth/api';
import { AuthFormShell } from '@auth/components/auth-form-shell';
import { normalizeApiError } from '@shared/api/api-error';
import { MAIN_BUTTON_TEXT } from '@shared/consts';
import { ButtonLink, LoadingState } from '@ui';

type VerificationStatus = 'loading' | 'success' | 'expired' | 'invalid';

const getVerificationStatus = (errorCode?: string): VerificationStatus => {
  if (errorCode === 'AUTH_EXPIRED_EMAIL_VERIFICATION_TOKEN') return 'expired';
  return 'invalid';
};

export const VerifyEmail = () => {
  const { t } = useTranslation('auth');
  const { t: tAuthErrors } = useTranslation('auth-errors');
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token')?.trim();
  const [status, setStatus] = useState<VerificationStatus>(token ? 'loading' : 'invalid');

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
  }, [searchParams, token]);

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

  const isSuccess = status === 'success';
  const description =
    status === 'expired'
      ? tAuthErrors('AUTH_EXPIRED_EMAIL_VERIFICATION_TOKEN')
      : status === 'invalid'
        ? tAuthErrors('AUTH_INVALID_EMAIL_VERIFICATION_TOKEN')
        : t('verifyEmailSuccessDescription');

  return (
    <AuthFormShell className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-2xl font-bold sm:text-3xl">
          {isSuccess ? t('verifyEmailSuccessTitle') : t('verifyEmailErrorTitle')}
        </h1>
        <p className="text-sm text-text-muted sm:text-base">{description}</p>
      </div>

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
