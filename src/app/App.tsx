import { Navigate, Route, Routes } from 'react-router-dom';

import { Login } from '@auth/components';
import { NamedResourcesList } from '@named-resources/components';
import { useAuthToken } from '@shared/hooks';
import { TransactionDetails, TransactionsList } from '@transactions/components';

import { MainLayout } from './layout';
import { ProtectedLayout, PublicLayout } from './routes';

function App() {
  const { isAuthenticated } = useAuthToken();

  return (
    <MainLayout>
      <Routes>
        <Route element={<PublicLayout isAuthenticated={isAuthenticated} />}>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
        </Route>

        <Route element={<ProtectedLayout isAuthenticated={isAuthenticated} />}>
          <Route path="/transactions" element={<TransactionsList />} />
          <Route path="/transactions/:transactionId" element={<TransactionDetails />} />
          <Route path="/categories" element={<NamedResourcesList kind="categories" />} />
          <Route
            path="/paymentMethods"
            element={<NamedResourcesList kind="paymentMethods" />}
          />
          <Route path="/accounts" element={<NamedResourcesList kind="accounts" />} />
          <Route path="/vehicles" element={<p>Vehicles will be there</p>} />
          <Route path="/sports" element={<p>Sports will be there</p>} />
          <Route path="/settings" element={<p>Settings will be there</p>} />
        </Route>
      </Routes>
    </MainLayout>
  );
}

export default App;
