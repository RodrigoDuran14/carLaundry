import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';
import { store } from './app/store';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Clientes from './pages/Clientes';
import Empleados from './pages/Empleados';
import Vehiculos from './pages/Vehiculos';
import TiposLavado from './pages/TiposLavado';
import Lavados from './pages/Lavados';
import LavadoDetail from './pages/LavadoDetail';
import Login from './pages/Login';

function App() {
  const isAuthenticated = localStorage.getItem('token');

  return (
    <Provider store={store}>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}
          >
            <Route index element={<Dashboard />} />
            <Route path="clientes" element={<Clientes />} />
            <Route path="empleados" element={<Empleados />} />
            <Route path="vehiculos" element={<Vehiculos />} />
            <Route path="tipos-lavado" element={<TiposLavado />} />
            <Route path="lavados/*" element={<Lavados />} />
            <Route path="lavados/:id" element={<LavadoDetail />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;