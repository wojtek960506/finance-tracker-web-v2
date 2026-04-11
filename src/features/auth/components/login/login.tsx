import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

import { login } from '@auth/api';
import { normalizeApiError } from '@shared/api/api-error';
import { MAIN_BUTTON_TEXT } from '@shared/consts';
import { useAuthToken } from '@shared/hooks';
import { Button, ButtonLink, Card, Input, Label } from '@ui';

export const Login = () => {
  const { t } = useTranslation('auth');
  const { t: tAuthErrors } = useTranslation('auth-errors');
  const emailInputRef = useRef<HTMLInputElement>(null);
  const [searchParams] = useSearchParams();
  const redirectedEmail = searchParams.get('email') ?? '';

  const [email, setEmail] = useState(redirectedEmail || 'w@z.pl');
  const [password, setPassword] = useState(redirectedEmail ? '' : '123');

  const [isEmailInputTouched, setIsEmailInputTouched] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const normalizedEmail = email.trim();
  const isInvalidEmail = !emailRegex.test(normalizedEmail);

  const showEmailError = isInvalidEmail && (isEmailInputTouched || isSubmitted);

  const { setAuthToken } = useAuthToken();

  useEffect(() => {
    emailInputRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsSubmitted(true);
    if (isInvalidEmail || normalizedEmail === '' || password === '') return;

    try {
      const res = await login(normalizedEmail, password);
      setAuthToken(res);

      // those probably not needed as it will reset during next render
      setIsSubmitted(false);
      setIsEmailInputTouched(false);
      setEmail('');
      setPassword('');
    } catch (error) {
      const apiError = normalizeApiError(error);
      alert(
        apiError.code
          ? tAuthErrors(apiError.code, { defaultValue: apiError.message })
          : apiError.message,
      );
    }
  };

  const labelCn = 'text-lg sm:text-xl font-bold';

  return (
    <div className="h-full flex justify-center items-center text-base sm:text-lg">
      <Card className="w-120">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col" /* rounded-3xl p-5 w-120 bg-modal-bg */
          autoComplete="off"
        >
          <Label>
            <span className={labelCn}>{t('email')}</span>
            <Input
              ref={emailInputRef}
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('emailPlaceholder')}
              onBlur={() => setIsEmailInputTouched(true)}
              autoComplete="off"
            />
          </Label>
          <p className="text-destructive text-xs sm:text-sm h-4 sm:h-5 my-1">
            {showEmailError ? t('invalidEmailFormat') : ''}
          </p>

          <Label>
            <span className={labelCn}>{t('password')}</span>
            <Input
              id="password"
              value={password}
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('passwordPlaceholder')}
              autoComplete="off"
            />
          </Label>

          <Button
            disabled={email === '' || password === '' || showEmailError}
            type="submit"
            className={clsx('mt-10', MAIN_BUTTON_TEXT)}
          >
            {t('logIn')}
          </Button>
          <ButtonLink to="/register" variant="outline" className={clsx('mt-3', MAIN_BUTTON_TEXT)}>
            {t('goToCreateAccount')}
          </ButtonLink>
        </form>
      </Card>
    </div>
  );
};
