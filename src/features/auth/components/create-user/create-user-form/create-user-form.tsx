import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import { LoaderCircle } from 'lucide-react';
import { useEffect } from 'react';
import { type SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { AuthFormShell } from '@auth/components/auth-form-shell';
import { FORM_BUTTON_SIZE_CLASS } from '@shared/consts';
import { Button, ButtonLink } from '@ui';

import { AuthFormInput } from '../../auth-form-input/auth-form-input';
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

      <div className="mt-6 flex flex-col gap-2">
        <Button
          disabled={isSubmitDisabled}
          type="submit"
          className={clsx(FORM_BUTTON_SIZE_CLASS, 'gap-2 font-semibold sm:font-bold')}
        >
          {isPending ? (
            <>
              <LoaderCircle className="size-4 animate-spin sm:size-5" aria-hidden="true" />
              {t('creatingAccount')}
            </>
          ) : (
            t('createAccount')
          )}
        </Button>
        <ButtonLink
          to="/login"
          variant="outline"
          preventFocusOnPress
          disabled={isPending}
          className={clsx(FORM_BUTTON_SIZE_CLASS, 'font-semibold sm:font-bold')}
        >
          {t('backToLogin')}
        </ButtonLink>
      </div>
    </AuthFormShell>
  );
};
