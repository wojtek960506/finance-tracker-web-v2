import axios from 'axios';

import { BASE_URL } from '@shared/consts';

export const logout = async () => {
  // Use plain axios here so logout is not affected by auth interceptors:
  // if this request returns 401, we do not want the shared client to try token refresh.
  await axios.post(`${BASE_URL}/api/auth/logout`, {}, { withCredentials: true });
  return;
};
