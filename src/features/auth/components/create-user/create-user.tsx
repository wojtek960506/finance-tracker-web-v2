import { useMutation } from '@tanstack/react-query';
import clsx from 'clsx';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { createUser } from '@auth/api';
import { normalizeApiError } from '@shared/api/api-error';
import { useToastStore } from '@store/toast-store';

import { CreateUserForm } from './create-user-form';
import { RegistrationSuccess } from './registration-success';
import type { CreateUserFormValues } from './utils';

const AUTH_PAGE_WRAPPER_CLASS = clsx(
  'flex h-full w-full items-center justify-center px-4',
  'bg-gradient-to-br from-[#f7fbe9] via-bg to-[#e7f1c9]',
  'dark:from-[#0d1306] dark:via-bg dark:to-[#182109]',
);
const CREATE_USER_CONTENT_CLASS = 'flex w-full max-w-[30rem] flex-col gap-12';

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

  return (
    <div className={AUTH_PAGE_WRAPPER_CLASS}>
      <div className={CREATE_USER_CONTENT_CLASS}>
        {createdEmail ? (
          <RegistrationSuccess createdEmail={createdEmail} />
        ) : (
          <CreateUserForm
            isPending={createUserMutation.isPending}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </div>
  );
};
