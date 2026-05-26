import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Route, Routes } from 'react-router-dom';

import { useAuthToken } from '@shared/hooks';
import {
  clearAuthToken,
  getAuthToken,
  refreshAuthToken,
  subscribeToAuthSessionEvents,
} from '@shared/store/auth-store';
import { useUIStore } from '@store/ui-store';
import { Card, LoadingState } from '@ui';

import { MainLayout } from './layout';
import {
  PROTECTED_APP_ROUTES,
  ProtectedLayout,
  PUBLIC_APP_ROUTES,
  PublicLayout,
} from './routes';


// TODOs
// - If the Transaction Type is empty, we could still click Create Transaction,
//   and that empty row would simply not be submitted (but this is only a maybe).
// - If a given row has an error, its background should probably become reddish
//   to draw more attention, especially on narrower screens.
// - On narrower screens, maybe change the layout so that the main presentation
//   is column-based instead of row-based.
// - “Add another row” could maybe be changed to “Add another one” or something similar,
//   because “row” is too tied to how it is currently presented.

function App() {
  const { t } = useTranslation('auth');
  const queryClient = useQueryClient();
  const { isAuthenticated, isAuthResolved } = useAuthToken();

  useEffect(() => {
    return subscribeToAuthSessionEvents({
      onLogin: () => {
        if (getAuthToken()) return;

        void refreshAuthToken();
      },
      onLogout: () => {
        void (async () => {
          // Cancel active requests first so late responses cannot repopulate auth-bound cache after logout.
          await queryClient.cancelQueries();
          clearAuthToken({ broadcast: false });
          queryClient.clear();
          useUIStore.getState().resetPersistedUIState();
        })();
      },
    });
  }, [queryClient]);

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
