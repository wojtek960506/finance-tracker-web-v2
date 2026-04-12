import { api } from '@shared/api';

export type CreateUserPayload = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export type CreateUserResponse = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};

export const createUser = async (payload: CreateUserPayload) => {
  const res = await api.post<CreateUserResponse>('/users', payload);
  return res.data;
};
