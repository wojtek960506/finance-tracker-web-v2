import { BASE_URL } from "@/consts";


export const login = async (email: string, password: string) => {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password })
  });

  if (!res.ok) throw new Error("login failure");

  const resJSON = await res.json();
  return resJSON["accessToken"];
}
