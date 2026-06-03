import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import { AuthFormShell } from '@auth/components/auth-form-shell';

import { FORM_BUTTON_SIZE_CLASS } from '@/shared/consts';
import { ButtonLink } from '@/shared/ui';

export const RegistrationSuccess = ({ createdEmail }: { createdEmail: string }) => {
  const { t } = useTranslation('auth');

  return (
    <AuthFormShell className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-2xl font-bold sm:text-3xl">
          {t('registrationSuccessTitle')}
        </h1>
        <p className="text-sm text-text-muted sm:text-base">
          {t('registrationSuccessDescription')}
        </p>
        <p className="text-sm font-medium sm:text-base">{createdEmail}</p>
      </div>

      <ButtonLink
        to="/login"
        variant="primary"
        className={clsx(FORM_BUTTON_SIZE_CLASS, 'font-semibold sm:font-bold')}
      >
        {t('backToLogin')}
      </ButtonLink>
    </AuthFormShell>
  );
};
