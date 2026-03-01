import { useState } from "react";
import { login } from "@/api/login";
import { useAuthToken } from "@/hooks/use-auth-token";
import { Label, Button, Input } from "@components/ui";


export const Login = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { setAuthToken } = useAuthToken();

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await login(email, password);
      setAuthToken(res);
    } catch (error) {
      alert(error)
    }
  }

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
          />
        </Label>
        
        <Label>
          <span>Password</span>
          <Input
            id="email"
            value={password}
            type="password"
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
          />
        </Label>


        <Button type="submit" className="mt-2">Login</Button>
      </form>
    </div>
  )
}
