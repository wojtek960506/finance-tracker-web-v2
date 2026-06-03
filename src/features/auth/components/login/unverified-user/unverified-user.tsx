import clsx from 'clsx';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { AuthFormShell } from '@auth/components/auth-form-shell';
import { Button } from '@ui';

import { resendVerification } from '@/features/auth/api';
import { FORM_BUTTON_SIZE_CLASS } from '@/shared/consts';

type UnverifiedUserProps = {
  unverifiedEmail: string;
  resetUnverifiedEmail: () => void;
};

export const UnverifiedUser = ({
  unverifiedEmail,
  resetUnverifiedEmail,
}: UnverifiedUserProps) => {
  const { t } = useTranslation('auth');
  const { t: tAuthErrors } = useTranslation('auth-errors');

  const [didResendVerification, setDidResendVerification] = useState(false);
  const [isResendPending, setIsResendPending] = useState(false);

  const resetUnverifiedState = () => {
    resetUnverifiedEmail();
    setDidResendVerification(false);
    setIsResendPending(false);
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

      {!didResendVerification && (
        <Button
          type="button"
          variant="primary"
          onClick={() => void handleResendVerification()}
          disabled={isResendPending}
          className={clsx(FORM_BUTTON_SIZE_CLASS, 'font-semibold sm:font-bold')}
        >
          {t('resendVerificationEmail')}
        </Button>
      )}

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
};
