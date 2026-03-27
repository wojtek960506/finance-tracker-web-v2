import clsx from 'clsx';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { login } from '@auth/api';
import { useAuthToken } from '@shared/hooks';
import { Button, Card, Input, Label } from '@ui';

export const Login = () => {
  const { t } = useTranslation('auth');

  const [email, setEmail] = useState('w@z.pl');
  const [password, setPassword] = useState('123');

  const [isEmailInputTouched, setIsEmailInputTouched] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isInvalidEmail = !emailRegex.test(email);

  const showEmailError = isInvalidEmail && (isEmailInputTouched || isSubmitted);

  const { setAuthToken } = useAuthToken();

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsSubmitted(true);

    try {
      const res = await login(email, password);
      setAuthToken(res);

      // those probably not needed as it will reset during next render
      setIsSubmitted(false);
      setIsEmailInputTouched(false);
      setEmail('');
      setPassword('');
    } catch (error) {
      alert(error);
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
            className={clsx('mt-10', labelCn)}
          >
            {t('logIn')}
          </Button>
        </form>
      </Card>
    </div>
  );
};
