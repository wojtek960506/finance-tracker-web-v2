import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { createUser } from '@auth/api';
import { normalizeApiError } from '@shared/api/api-error';
import { useToastStore } from '@store/toast-store';

import { CreateUserForm } from './create-user-form';
import { RegistrationSuccess } from './registration-success';
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

  if (createdEmail) return <RegistrationSuccess createdEmail={createdEmail} />;
  return <CreateUserForm isPending={createUserMutation.isPending} onSubmit={handleSubmit} />;
};
