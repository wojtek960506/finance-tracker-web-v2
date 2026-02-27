import { Route, Routes } from 'react-router-dom';
import { Login, Transactions } from './components/routes';


function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/transactions" element={<Transactions />} />
    </Routes>
  )
}

export default App;
