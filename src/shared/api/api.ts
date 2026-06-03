import axios from 'axios';

import { BASE_URL } from '@shared/consts';
import { clearAuthToken, getAuthToken, refreshAuthToken } from '@shared/store/auth-store';

import { normalizeApiError } from './api-error';

export const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  withCredentials: true, // when later support for refresh token will be added
});

// add auth token automatically
api.interceptors.request.use((config) => {
  const token = getAuthToken();

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

      const newToken = await refreshAuthToken();

      if (newToken) {
        // retry original request
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      }

      clearAuthToken();
    }

    return Promise.reject(normalizeApiError(error));
  },
);
