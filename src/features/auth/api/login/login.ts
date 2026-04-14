import { api } from '@shared/api';

export const login = async (email: string, password: string) => {
  const res = await api.post<{ accessToken: string }>('/auth/login', { email, password });
  return res.data.accessToken;
};
