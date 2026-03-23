import { useLocalStorage } from './use-local-storage';

const AUTH_TOKEN_STORE_KEY = 'auth-token';

export const useAuthToken = () => {
  const {
    item: authToken,
    setItem: setAuthToken,
    removeItem: removeAuthToken,
  } = useLocalStorage<string>(AUTH_TOKEN_STORE_KEY);

  return { authToken, setAuthToken, removeAuthToken, isAuthenticated: !!authToken };
};
