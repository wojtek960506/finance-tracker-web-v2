import { Route, Routes } from 'react-router-dom';

import { useAuthToken } from '@shared/hooks';

import { MainLayout } from './layout';
import {
  PROTECTED_APP_ROUTES,
  ProtectedLayout,
  PUBLIC_APP_ROUTES,
  PublicLayout,
} from './routes';

function App() {
  const { isAuthenticated } = useAuthToken();

  return (
    <MainLayout>
      <Routes>
        <Route element={<PublicLayout isAuthenticated={isAuthenticated} />}>
          {PUBLIC_APP_ROUTES.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Route>

        <Route element={<ProtectedLayout isAuthenticated={isAuthenticated} />}>
          {PROTECTED_APP_ROUTES.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Route>
      </Routes>
    </MainLayout>
  );
}

export default App;
