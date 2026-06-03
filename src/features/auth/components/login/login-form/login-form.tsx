import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { type SubmitHandler,useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { AuthFormButtons } from '@auth/components/auth-form-buttons';
import { AuthFormInput } from '@auth/components/auth-form-input';
import { AuthFormShell } from '@auth/components/auth-form-shell';

import { getDefaultLoginFormValues, loginFormSchema, type LoginFormValues } from "./utils";

type LoginFormProps = {
  redirectedEmail?: string;
  isPending: boolean;
  onSubmit: (values: LoginFormValues) => Promise<void> | void;
};

type FieldName = keyof LoginFormValues;

export const LoginForm = ({ redirectedEmail, isPending, onSubmit }: LoginFormProps) => {
  const { t } = useTranslation('auth');
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: getDefaultLoginFormValues(redirectedEmail),
    mode: 'onBlur',
    reValidateMode: 'onBlur',
  });
  const values = useWatch({ control: form.control });

  useEffect(() => { form.setFocus('email') }, [form]);

  const handleSubmit: SubmitHandler<LoginFormValues> = async (submittedValues) => {
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
    !loginFormSchema.safeParse(values ?? getDefaultLoginFormValues()).success ||
    isPending;

  return (
    <AuthFormShell onSubmit={form.handleSubmit(handleSubmit)}>
      {(['email', 'password'] as FieldName[]).map(
        name => (
          <AuthFormInput
            form={form}
            name={name}
            placeholder={`${name}Placeholder`}
            getFieldErrorMessage={getFieldErrorMessage}
            type={name === 'password' ? 'password' : 'text'}
          />  
        )
      )}

      <AuthFormButtons
        isPrimaryPending={isPending}
        isPrimaryDisabled={isSubmitDisabled}
        primaryText={t('logIn')}
        primaryTextPending={t('loggingIn')}
        isSecondaryDisabled={isPending}
        secondaryText={t('goToCreateAccount')}
        secondaryTo='/register'
      />
    </AuthFormShell>
  );
}