import { MobileLayout } from "@components/layout";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


export const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (email === "wz" && password === "123") {
      navigate("/transactions")
    }
    else {
      alert("invalid credentials")
    }

  }


  return (
    <MobileLayout>
      <h1>Login will be here</h1>

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



    </MobileLayout>
  )
}
