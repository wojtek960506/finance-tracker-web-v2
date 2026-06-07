import { Trans, useTranslation } from 'react-i18next';

import { normalizeApiError } from '@/shared/api/api-error';
import { useToastStore } from '@/shared/store/toast-store';

export const useCatchLoginError = (setUnverifiedEmail: (val: string | null) => void) => {
  const { t } = useTranslation('auth-errors');
  const pushToast = useToastStore((state) => state.pushToast);

  const catchLoginError = (error: unknown, email: string) => {
    const apiError = normalizeApiError(error);

    if (apiError.code === 'AUTH_EMAIL_NOT_VERIFIED') {
      setUnverifiedEmail(email);
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
            values={{ email }}
            defaults={apiError.message}
            components={{ strong: <strong className="font-semibold" /> }}
          />
        ) : apiError.code ? (
          t(apiError.code, { defaultValue: apiError.message })
        ) : (
          apiError.message
        ),
    });
  };
  return catchLoginError;
};
