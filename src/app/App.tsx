import { useTranslation } from 'react-i18next';
import { Route, Routes } from 'react-router-dom';

import { useAuthToken } from '@shared/hooks';
import { Card, LoadingState } from '@ui';

import { MainLayout } from './layout';
import {
  PROTECTED_APP_ROUTES,
  ProtectedLayout,
  PUBLIC_APP_ROUTES,
  PublicLayout,
} from './routes';

function App() {
  const { t } = useTranslation('auth');
  const { isAuthenticated, isAuthResolved } = useAuthToken();

  if (!isAuthResolved) {
    return (
      <MainLayout>
        <div className="mx-auto w-full max-w-[35rem]">
          <Card className="mt-2 gap-4 rounded-3xl border-fg/20 bg-modal-bg/95 p-6 sm:mt-3 sm:p-8">
            <LoadingState
              title={t('restoringSessionTitle')}
              description={t('restoringSessionDescription')}
              className="py-4"
            />
          </Card>
        </div>
      </MainLayout>
    );
  }

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
