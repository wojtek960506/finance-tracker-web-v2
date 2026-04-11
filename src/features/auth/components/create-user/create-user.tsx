import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { createUser } from '@auth/api';
import { normalizeApiError } from '@shared/api/api-error';
import { MAIN_BUTTON_TEXT } from '@shared/consts';
import { useToastStore } from '@store/toast-store';
import { Button, ButtonLink, Card, Input, Label } from '@ui';

type TouchedFields = {
  firstName: boolean;
  lastName: boolean;
  email: boolean;
  password: boolean;
  confirmPassword: boolean;
};

export const CreateUser = () => {
  const { t } = useTranslation('auth');
  const { t: tUserErrors } = useTranslation('user-errors');
  const firstNameInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const pushToast = useToastStore((state) => state.pushToast);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [touchedFields, setTouchedFields] = useState<TouchedFields>({
    firstName: false,
    lastName: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  useEffect(() => {
    firstNameInputRef.current?.focus();
  }, []);

  const markFieldAsTouched = (field: keyof TouchedFields) => {
    setTouchedFields((prevState) => ({ ...prevState, [field]: true }));
  };

  const normalizedFirstName = firstName.trim();
  const normalizedLastName = lastName.trim();
  const normalizedEmail = email.trim();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isInvalidFirstName = normalizedFirstName.length < 2;
  const isInvalidLastName = normalizedLastName.length < 2;
  const isInvalidEmail = !emailRegex.test(normalizedEmail);
  const isInvalidPassword = password.length < 3;
  const doPasswordsMismatch = password !== confirmPassword;

  const showFirstNameError = isInvalidFirstName && (touchedFields.firstName || isSubmitted);
  const showLastNameError = isInvalidLastName && (touchedFields.lastName || isSubmitted);
  const showEmailError = isInvalidEmail && (touchedFields.email || isSubmitted);
  const showPasswordError = isInvalidPassword && (touchedFields.password || isSubmitted);
  const showConfirmPasswordError =
    doPasswordsMismatch && (touchedFields.confirmPassword || isSubmitted);

  const isSubmitDisabled =
    normalizedFirstName === '' ||
    normalizedLastName === '' ||
    normalizedEmail === '' ||
    password === '' ||
    confirmPassword === '' ||
    isInvalidFirstName ||
    isInvalidLastName ||
    isInvalidEmail ||
    isInvalidPassword ||
    doPasswordsMismatch;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsSubmitted(true);
    if (isSubmitDisabled) return;

    try {
      await createUser({
        firstName: normalizedFirstName,
        lastName: normalizedLastName,
        email: normalizedEmail,
        password,
      });

      pushToast({
        variant: 'success',
        message: (
          <Trans
            ns="auth"
            i18nKey="userCreatedSuccessfully"
            values={{ fullName: `${normalizedFirstName} ${normalizedLastName}` }}
            components={{ strong: <strong className="font-semibold" /> }}
          />
        ),
      });
      navigate(`/login?email=${encodeURIComponent(normalizedEmail)}`, { replace: true });
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

  const labelCn = 'text-lg sm:text-xl font-bold';
  const errorCn = 'text-destructive text-xs sm:text-sm h-4 sm:h-5 my-1';

  return (
    <div className="h-full flex justify-center items-center text-base sm:text-lg">
      <Card className="w-120">
        <form onSubmit={handleSubmit} className="flex flex-col" autoComplete="off">
          <Label>
            <span className={labelCn}>{t('firstName')}</span>
            <Input
              ref={firstNameInputRef}
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder={t('firstNamePlaceholder')}
              onBlur={() => markFieldAsTouched('firstName')}
              autoComplete="off"
            />
          </Label>
          <p className={errorCn}>{showFirstNameError ? t('firstNameTooShort') : ''}</p>

          <Label>
            <span className={labelCn}>{t('lastName')}</span>
            <Input
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder={t('lastNamePlaceholder')}
              onBlur={() => markFieldAsTouched('lastName')}
              autoComplete="off"
            />
          </Label>
          <p className={errorCn}>{showLastNameError ? t('lastNameTooShort') : ''}</p>

          <Label>
            <span className={labelCn}>{t('email')}</span>
            <Input
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('emailPlaceholder')}
              onBlur={() => markFieldAsTouched('email')}
              autoComplete="off"
            />
          </Label>
          <p className={errorCn}>{showEmailError ? t('invalidEmailFormat') : ''}</p>

          <Label>
            <span className={labelCn}>{t('password')}</span>
            <Input
              id="password"
              value={password}
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('passwordPlaceholder')}
              onBlur={() => markFieldAsTouched('password')}
              autoComplete="off"
            />
          </Label>
          <p className={errorCn}>{showPasswordError ? t('passwordTooShort') : ''}</p>

          <Label>
            <span className={labelCn}>{t('confirmPassword')}</span>
            <Input
              id="confirmPassword"
              value={confirmPassword}
              type="password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder={t('confirmPasswordPlaceholder')}
              onBlur={() => markFieldAsTouched('confirmPassword')}
              autoComplete="off"
            />
          </Label>
          <p className={errorCn}>
            {showConfirmPasswordError ? t('passwordsDoNotMatch') : ''}
          </p>

          <Button
            disabled={isSubmitDisabled}
            type="submit"
            className={clsx('mt-10', MAIN_BUTTON_TEXT)}
          >
            {t('createAccount')}
          </Button>
          <ButtonLink to="/login" variant="outline" className={clsx('mt-3', MAIN_BUTTON_TEXT)}>
            {t('backToLogin')}
          </ButtonLink>
        </form>
      </Card>
    </div>
  );
};
