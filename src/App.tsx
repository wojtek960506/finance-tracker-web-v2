import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import {
  Login,
  Transactions,
  ProtectedRoute,
  PublicOnlyRoute,
} from './components/routes';


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  console.log("isAuthenticated", isAuthenticated);

  const loginElement = (
    <PublicOnlyRoute isAuthenticated={isAuthenticated}>
      <Login handleIsAuthenticated={(val: boolean) => setIsAuthenticated(val)} />
    </PublicOnlyRoute>
  );

  return (
    <Routes>
      <Route path="/" element={loginElement}/>
      <Route path="/login" element={loginElement}/>
      <Route path="/transactions" element={
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <Transactions handleIsAuthenticated={(val: boolean) => setIsAuthenticated(val)} />
        </ProtectedRoute>
      } />
    </Routes>
  )
}

export default App;
