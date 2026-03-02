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
    <div className="h-full flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col border border-fg rounded-3xl p-5 max-w-120 gap-2"
      >
        <Label>
          <span>Email</span>
          <Input
            id="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email"
            onBlur={() => setIsEmailInputTouched(true)}
          />
        </Label>
        {showEmailError && <span className="text-destructive">Invalid email format</span>}

        <Label>
          <span>Password</span>
          <Input
            id="password"
            value={password}
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
        </Label>

        <Button
          disabled={email === "" || password === "" || showEmailError}
          type="submit" className="mt-2"
        >
          {t('logIn')}
        </Button>
      </form>
    </div>
  );
};
