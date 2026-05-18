import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import { useEffect } from 'react';
import { type SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { AuthFormField } from '@auth/components/auth-form-field';
import { AuthFormShell } from '@auth/components/auth-form-shell';
import { FORM_BUTTON_SIZE_CLASS } from '@shared/consts';
import { FIELD_CONTROL_CLASS_NAME } from '@transactions/components/transaction-forms';
import { Button, ButtonLink, Input } from '@ui';

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

// TODO split this component
export const CreateUserForm = ({ isPending, onSubmit }: CreateUserFormProps) => {
  const { t } = useTranslation('auth');
  const form = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserFormSchema),
    defaultValues: getDefaultCreateUserFormValues(),
    mode: 'onBlur',
    reValidateMode: 'onBlur',
  });
  const values = useWatch({
    control: form.control,
  });

  useEffect(() => {
    form.setFocus('firstName');
  }, [form]);

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
      <AuthFormField
        label={t('firstName')}
        required
        error={getFieldErrorMessage('firstName')}
      >
        <Input
          {...form.register('firstName')}
          id="firstName"
          placeholder={t('firstNamePlaceholder')}
          autoComplete="off"
          className={FIELD_CONTROL_CLASS_NAME}
        />
      </AuthFormField>

      <AuthFormField
        label={t('lastName')}
        required
        error={getFieldErrorMessage('lastName')}
      >
        <Input
          {...form.register('lastName')}
          id="lastName"
          placeholder={t('lastNamePlaceholder')}
          autoComplete="off"
          className={FIELD_CONTROL_CLASS_NAME}
        />
      </AuthFormField>

      <AuthFormField label={t('email')} required error={getFieldErrorMessage('email')}>
        <Input
          {...form.register('email')}
          id="email"
          placeholder={t('emailPlaceholder')}
          autoComplete="off"
          className={FIELD_CONTROL_CLASS_NAME}
        />
      </AuthFormField>

      <AuthFormField
        label={t('password')}
        required
        error={getFieldErrorMessage('password')}
      >
        <Input
          {...form.register('password')}
          id="password"
          type="password"
          placeholder={t('passwordPlaceholder')}
          autoComplete="off"
          className={FIELD_CONTROL_CLASS_NAME}
        />
      </AuthFormField>

      <AuthFormField
        label={t('confirmPassword')}
        required
        error={getFieldErrorMessage('confirmPassword')}
      >
        <Input
          {...form.register('confirmPassword')}
          id="confirmPassword"
          type="password"
          placeholder={t('confirmPasswordPlaceholder')}
          autoComplete="off"
          className={FIELD_CONTROL_CLASS_NAME}
        />
      </AuthFormField>

      <div className="mt-6 flex flex-col gap-2">
        <Button
          disabled={isSubmitDisabled}
          type="submit"
          className={clsx(FORM_BUTTON_SIZE_CLASS, 'font-semibold sm:font-bold')}
        >
          {t('createAccount')}
        </Button>
        <ButtonLink
          to="/login"
          variant="outline"
          preventFocusOnPress
          className={clsx(FORM_BUTTON_SIZE_CLASS, 'font-semibold sm:font-bold')}
        >
          {t('backToLogin')}
        </ButtonLink>
      </div>
    </AuthFormShell>
  );
};
