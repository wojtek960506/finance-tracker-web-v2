import { useAuthToken } from '@shared/hooks';
import { MainLayout } from './layout';
import { Navigate, Route, Routes } from 'react-router-dom';
import { PublicLayout, ProtectedLayout } from './routes';
import { TransactionsRoute } from '@/features/transactions/routes';
import { LoginRoute } from '@/features/auth/routes';


function App() {

  const { isAuthenticated } = useAuthToken();

  return (
    <MainLayout>
      <Routes>

        <Route element={<PublicLayout isAuthenticated={isAuthenticated} />}>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginRoute />} />
        </Route>
        
        <Route element={<ProtectedLayout isAuthenticated={isAuthenticated} />}>
          <Route path="/transactions" element={<TransactionsRoute />} />
          <Route path="/categories" element={<p>Categories will be there</p>} />
          <Route path="/paymentMethods" element={<p>Payment methods will be there</p>} />
          <Route path="/accounts" element={<p>Accounts will be there</p>} />
          <Route path="/vehicles" element={<p>Vehicles will be there</p>} />
          <Route path="/sports" element={<p>Sports will be there</p>} />
          <Route path="/settings" element={<p>Settings will be there</p>} />
        </Route>

      </Routes>
    </MainLayout>
  )
}

export default App;
