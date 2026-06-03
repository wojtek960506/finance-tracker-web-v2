import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { type SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { AuthFormButtons } from '@auth/components/auth-form-buttons';
import { AuthFormInput } from '@auth/components/auth-form-input';
import { AuthFormShell } from '@auth/components/auth-form-shell';

import {
  createUserFormSchema,
  type CreateUserFormValues,
  getDefaultCreateUserFormValues,
} from '../utils';

type CreateUserFormProps = {
  isPending: boolean;
  onSubmit: (values: CreateUserFormValues) => Promise<void> | void;
};

type FieldName = keyof CreateUserFormValues;

export const CreateUserForm = ({ isPending, onSubmit }: CreateUserFormProps) => {
  const { t } = useTranslation('auth');
  const form = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserFormSchema),
    defaultValues: getDefaultCreateUserFormValues(),
    mode: 'onBlur',
    reValidateMode: 'onBlur',
  });
  const values = useWatch({ control: form.control });

  useEffect(() => { form.setFocus('firstName') }, [form]);

  const handleSubmit: SubmitHandler<CreateUserFormValues> = async (submittedValues) => {
    await onSubmit(submittedValues);
  };

  const getFieldErrorMessage = (fieldName: FieldName) => {
    const fieldError = form.formState.errors[fieldName]?.message;
    const isTouched = form.formState.touchedFields[fieldName];
    const wasSubmitted = form.formState.submitCount > 0;

    if (!fieldError || (!isTouched && !wasSubmitted)) return undefined;
    return t(fieldError);
  };

  const isSubmitDisabled =
    !createUserFormSchema.safeParse(values ?? getDefaultCreateUserFormValues()).success ||
    isPending;

  return (
    <AuthFormShell onSubmit={form.handleSubmit(handleSubmit)}>
      {(['firstName', 'lastName', 'email', 'password', 'confirmPassword'] as FieldName[]).map(
        name => (
          <AuthFormInput
            form={form}
            name={name}
            placeholder={`${name}Placeholder`}
            getFieldErrorMessage={getFieldErrorMessage}
            type={['password', 'confirmPassword'].includes(name) ? 'password' : 'text'}
          />  
        )
      )}

      <AuthFormButtons
        isPrimaryPending={isPending}
        isPrimaryDisabled={isSubmitDisabled}
        primaryText={t('createAccount')}
        primaryTextPending={t('creatingAccount')}
        isSecondaryDisabled={isPending}
        secondaryText={t('backToLogin')}
        secondaryTo='/login'
      />
      
    </AuthFormShell>
  );
};
