import { useAuthToken } from './hooks';
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
    <Routes>

      <Route element={<PublicLayout isAuthenticated={isAuthenticated} />}>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
      </Route>
      
      <Route element={<ProtectedLayout isAuthenticated={isAuthenticated} />}>
        <Route path="/transactions" element={<Transactions />} />
      </Route>

    </Routes>
  )
}

export default App;
