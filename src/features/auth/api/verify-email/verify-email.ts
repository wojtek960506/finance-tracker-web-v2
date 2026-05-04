import { api } from '@shared/api';

export type VerifyEmailPayload = {
  token: string;
};

export const verifyEmail = async ({ token }: VerifyEmailPayload) => {
  await api.post('/auth/verify-email', { token });
};
