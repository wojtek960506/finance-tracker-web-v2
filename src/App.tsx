import { Navigate, Route, Routes } from 'react-router-dom';
import { useLocalStorage } from './hooks/use-local-storage';
import {
  Login,
  Transactions,
  PublicLayout,
  ProtectedLayout,
} from './components/routes';


function App() {

  const { item: token } = useLocalStorage<string>("token");

  const isAuthenticated = !!token;

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
