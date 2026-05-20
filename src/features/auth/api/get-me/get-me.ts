import { api } from '@shared/api';

export type MeResponse = {
  firstName: string;
  lastName: string;
  email: string;
  id: string;
  emailVerifiedAt: Date | null;
  emailVerificationMethod: "legacy-backfill" | "self-verified" | null;
  createdAt: Date;
  updatedAt: Date;
}

export const getMe = async () => {
  const res = await api.get<MeResponse>('/auth/me');
  return res.data;
};
