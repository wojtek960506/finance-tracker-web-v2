import { useMutation } from '@tanstack/react-query';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { createUser } from '@auth/api';
import { normalizeApiError } from '@shared/api/api-error';
import { useToastStore } from '@store/toast-store';

import { CreateUserForm } from './create-user-form';
import type { CreateUserFormValues } from './utils';

export const CreateUser = () => {
  const { t } = useTranslation('auth');
  const { t: tUserErrors } = useTranslation('user-errors');
  const navigate = useNavigate();
  const pushToast = useToastStore((state) => state.pushToast);
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
    firstName,
    lastName,
    email,
    password,
  }: CreateUserFormValues) => {
    try {
      await createUserMutation.mutateAsync({
        firstName,
        lastName,
        email,
        password,
      });

      pushToast({
        variant: 'success',
        message: (
          <Trans
            ns="auth"
            i18nKey="userCreatedSuccessfully"
            values={{ fullName: `${firstName} ${lastName}` }}
            components={{ strong: <strong className="font-semibold" /> }}
          />
        ),
      });
      navigate(`/login?email=${encodeURIComponent(email)}`, { replace: true });
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
    <CreateUserForm isPending={createUserMutation.isPending} onSubmit={handleSubmit} />
  );
};
