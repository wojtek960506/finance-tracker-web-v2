import { AUTH_TOKEN_STORE_KEY } from '@shared/consts';

import { useLocalStorage } from '../use-local-storage';

export const useAuthToken = () => {
  const {
    item: authToken,
    setItem: setAuthToken,
    removeItem: removeAuthToken,
  } = useLocalStorage<string>(AUTH_TOKEN_STORE_KEY);

  return { authToken, setAuthToken, removeAuthToken, isAuthenticated: !!authToken };
};
