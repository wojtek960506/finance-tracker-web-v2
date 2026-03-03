import { useState } from "react";
import { login } from "@/api/login";
import { useTranslation } from "react-i18next";
import { useAuthToken } from "@/hooks/use-auth-token";
import { Label, Button, Input } from "@components/ui";


export const Login = () => {
  const { t } = useTranslation("auth");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isEmailInputTouched, setIsEmailInputTouched] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isInvalidEmail = !emailRegex.test(email);

  const showEmailError = isInvalidEmail && (isEmailInputTouched || isSubmitted);

  const { setAuthToken } = useAuthToken();

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsSubmitted(true);

    if (isInvalidEmail) return;

    try {
      const res = await login(email, password);
      setAuthToken(res);

      // those probably not needed as it will reset during next render
      setIsSubmitted(false);
      setIsEmailInputTouched(false);
      setEmail("");
      setPassword("");
    } catch (error) {
      alert(error);
    } 
  };

  return (
    <div className="h-full flex justify-center items-center text-lg">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col g rounded-3xl p-5 w-120 bg-modal-bg"
        autoComplete="off"
      >
        
        <Label>
          <span>{t('email')}</span>
          <Input
            id="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder={t('emailPlaceholder')}
            onBlur={() => setIsEmailInputTouched(true)}
            autoComplete="off"
          />
        </Label>
        <p className="text-destructive text-sm min-h-5 my-1">
          {showEmailError ? t('invalidEmailFormat') : ""}
        </p>

        <Label>
          <span>{t('password')}</span>
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
          disabled={email === "" || password === "" || showEmailError}
          type="submit"
          className="mt-10"
        >  
          {t('logIn')}
        </Button>
      </form>
    </div>
  );
};
