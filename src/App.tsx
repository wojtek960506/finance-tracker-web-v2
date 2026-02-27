import { Route, Routes } from 'react-router-dom';
import { useLocalStorage } from './hooks/use-local-storage';
import {
  Login,
  Transactions,
  ProtectedRoute,
  PublicOnlyRoute,
} from './components/routes';


function App() {

  const { item: token } = useLocalStorage<string>("token")

  const isAuthenticated = !!token;

  console.log("token", token);
  console.log("isAuthenticated", isAuthenticated);
  console.log("---------------------");

  const loginElement = (
    <PublicOnlyRoute isAuthenticated={isAuthenticated}>
      <Login />
    </PublicOnlyRoute>
  );

  return (
    <Routes>
      <Route path="/" element={loginElement}/>
      <Route path="/login" element={loginElement}/>
      <Route path="/transactions" element={
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <Transactions />
        </ProtectedRoute>
      } />
    </Routes>
  )
}

export default App;
