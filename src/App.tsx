import { useAuthToken } from './hooks';
import { MobileLayout } from './components/layout';
import { Navigate, Route, Routes } from 'react-router-dom';
import {
  Login,
  Transactions,
  PublicLayout,
  ProtectedLayout,
} from './components/routes';


function App() {

  const { authToken } = useAuthToken();
  const isAuthenticated = !!authToken;

  return (
    <MobileLayout>
      <Routes>

        <Route element={<PublicLayout isAuthenticated={isAuthenticated} />}>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
        </Route>
        
        <Route element={<ProtectedLayout isAuthenticated={isAuthenticated} />}>
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/categories" element={<p>Categories will be there</p>} />
          <Route path="/paymentMethods" element={<p>Payment methods will be there</p>} />
          <Route path="/accounts" element={<p>Accounts will be there</p>} />
          <Route path="/vehicles" element={<p>Vehicles will be there</p>} />
          <Route path="/sports" element={<p>Sports will be there</p>} />
          <Route path="/settings" element={<p>Settings will be there</p>} />
        </Route>

      </Routes>
    </MobileLayout>
  )
}

export default App;
