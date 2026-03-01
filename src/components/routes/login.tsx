import { useState } from "react";
import { login } from "@/api/login";
import { useAuthToken } from "@/hooks/use-auth-token";


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
    <form onSubmit={handleSubmit}>
      <label htmlFor="email">Email</label>
      <input
        id="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Email"
      />
      
      <label htmlFor="password">Password</label>
      <input
        id="password"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Password"
      />

      <button type="submit">Login</button>
    </form>
  )
}
