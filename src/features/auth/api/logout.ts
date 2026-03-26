import { api } from '@shared/api';

export const logout = async () => {
  await api.post('/auth/logout', {});
  return;
};
