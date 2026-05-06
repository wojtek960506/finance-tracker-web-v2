import { api } from '@shared/api';

export type ResendVerificationPayload = {
  email: string;
};

export const resendVerification = async ({ email }: ResendVerificationPayload) => {
  await api.post('/auth/resend-verification', { email });
};
