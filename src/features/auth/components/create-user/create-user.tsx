import { useMutation } from '@tanstack/react-query';
import clsx from 'clsx';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { createUser } from '@auth/api';
import { AuthFormShell } from '@auth/components/auth-form-shell';
import { normalizeApiError } from '@shared/api/api-error';
import { FORM_BUTTON_SIZE_CLASS } from '@shared/consts';
import { useToastStore } from '@store/toast-store';
import { ButtonLink } from '@ui';

import { CreateUserForm } from './create-user-form';
import type { CreateUserFormValues } from './utils';

export const CreateUser = () => {
  const { t } = useTranslation('auth');
  const { t: tUserErrors } = useTranslation('user-errors');
  const pushToast = useToastStore((state) => state.pushToast);
  const [createdEmail, setCreatedEmail] = useState<string | null>(null);
  const createUserMutation = useMutation({
    mutationFn: async ({
      firstName,
      lastName,
      email,
      password,
    }: Omit<CreateUserFormValues, 'confirmPassword'>) =>
      await createUser({ firstName, lastName, email, password }),
  });

  const handleSubmit = async ({
    email,
    password,
    firstName,
    lastName,
  }: CreateUserFormValues) => {
    try {
      await createUserMutation.mutateAsync({
        firstName,
        lastName,
        email,
        password,
      });
      setCreatedEmail(email);
    } catch (error) {
      const apiError = normalizeApiError(error);
      pushToast({
        variant: 'error',
        title: t('createAccountFailed'),
        message: apiError.code
          ? tUserErrors(apiError.code, { defaultValue: apiError.message })
          : apiError.message,
      });
    }
  };

  if (createdEmail) {
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
  }

  return (
    <CreateUserForm isPending={createUserMutation.isPending} onSubmit={handleSubmit} />
  );
};
