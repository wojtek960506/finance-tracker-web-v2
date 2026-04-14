import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import { useEffect } from 'react';
import { type SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { AuthFormShell } from '@auth/components/auth-form-shell';
import { MAIN_BUTTON_TEXT } from '@shared/consts';
import { Button, ButtonLink, Input, Label } from '@ui';

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
  const labelCn = 'text-lg sm:text-xl font-bold';
  const errorCn = 'text-destructive text-xs sm:text-sm h-4 sm:h-5 my-1';

  return (
    <AuthFormShell onSubmit={form.handleSubmit(handleSubmit)}>
      <Label>
        <span className={labelCn}>{t('firstName')}</span>
        <Input
          {...form.register('firstName')}
          id="firstName"
          placeholder={t('firstNamePlaceholder')}
          autoComplete="off"
        />
      </Label>
      <p className={errorCn}>{getFieldErrorMessage('firstName') ?? ''}</p>

      <Label>
        <span className={labelCn}>{t('lastName')}</span>
        <Input
          {...form.register('lastName')}
          id="lastName"
          placeholder={t('lastNamePlaceholder')}
          autoComplete="off"
        />
      </Label>
      <p className={errorCn}>{getFieldErrorMessage('lastName') ?? ''}</p>

      <Label>
        <span className={labelCn}>{t('email')}</span>
        <Input
          {...form.register('email')}
          id="email"
          placeholder={t('emailPlaceholder')}
          autoComplete="off"
        />
      </Label>
      <p className={errorCn}>{getFieldErrorMessage('email') ?? ''}</p>

      <Label>
        <span className={labelCn}>{t('password')}</span>
        <Input
          {...form.register('password')}
          id="password"
          type="password"
          placeholder={t('passwordPlaceholder')}
          autoComplete="off"
        />
      </Label>
      <p className={errorCn}>{getFieldErrorMessage('password') ?? ''}</p>

      <Label>
        <span className={labelCn}>{t('confirmPassword')}</span>
        <Input
          {...form.register('confirmPassword')}
          id="confirmPassword"
          type="password"
          placeholder={t('confirmPasswordPlaceholder')}
          autoComplete="off"
        />
      </Label>
      <p className={errorCn}>{getFieldErrorMessage('confirmPassword') ?? ''}</p>

      <Button
        disabled={isSubmitDisabled}
        type="submit"
        className={clsx('mt-10', MAIN_BUTTON_TEXT)}
      >
        {t('createAccount')}
      </Button>
      <ButtonLink
        to="/login"
        variant="outline"
        className={clsx('mt-3', MAIN_BUTTON_TEXT)}
      >
        {t('backToLogin')}
      </ButtonLink>
    </AuthFormShell>
  );
};
