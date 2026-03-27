import axios from 'axios';

import {
  AUTH_TOKEN_STORE_KEY,
  BASE_URL,
  LOCAL_STORAGE_CHANGE_EVENT,
} from '@shared/consts';
import { readLocalStorage } from '@shared/utils';

export const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  withCredentials: true, // when later support for refresh token will be added
});

// add auth token automatically
api.interceptors.request.use((config) => {
  const token = readLocalStorage(AUTH_TOKEN_STORE_KEY);

  if (token) config.headers.Authorization = `Bearer ${token}`;

  return config;
});

// handle expired tokens
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // if access token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await axios.get<{ accessToken: string }>(
          `${BASE_URL}/api/auth/refresh`,
          { withCredentials: true },
        );

        // save new auth token and send event to update data in the current tab
        // event "storage" to update data in other tabs will be automatically dispatched
        // by setting item in localStorage
        const newToken = res.data.accessToken;
        window.localStorage.setItem(AUTH_TOKEN_STORE_KEY, JSON.stringify(newToken));
        window.dispatchEvent(
          new CustomEvent(LOCAL_STORAGE_CHANGE_EVENT, {
            detail: { key: AUTH_TOKEN_STORE_KEY },
          }),
        );

        // retry original request
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch {
        // logout user and update data in the current tab
        window.localStorage.removeItem(AUTH_TOKEN_STORE_KEY);
        window.dispatchEvent(
          new CustomEvent(LOCAL_STORAGE_CHANGE_EVENT, {
            detail: { key: AUTH_TOKEN_STORE_KEY },
          }),
        );
      }
    }
  },
);
