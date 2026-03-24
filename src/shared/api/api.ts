import axios from 'axios';

import { AUTH_TOKEN_STORE_KEY, BASE_URL } from '@shared/consts';
import { readLocalStorage } from '@shared/utils';

export const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  withCredentials: true,    // when later support for refresh token will be added
});

// add auth token automatically
api.interceptors.request.use(config => {
  const token = readLocalStorage(AUTH_TOKEN_STORE_KEY)

  if (token) config.headers.Authorization = `Bearer ${token}`;
  
  return config;
})