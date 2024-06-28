import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import { PrivateRoute } from "./components/PrivateRoute";
import NavBar from "./components/NavBar";
import Clientes from "./pages/Clientes";
import Empleados from "./pages/Empleados";
import Vehiculos from "./pages/Vehiculos";
import TiposLavados from "./pages/TiposLavados";
import Lavados from "./pages/Lavados";
import FormCliente from "./components/Clientes/FormCliente";
import FormVehiculo from "./components/Vehiculos/FormVehiculo";
import FormEmpleado from "./components/Empleados/FormEmpleado";
import FormLavado from "./components/Lavados/FormLavado";
import FormTiposLavado from "./components/TiposLavado/FormTiposLavado";
import EditarCliente from "./components/Clientes/EditarCliente";
import EditarVehiculo from "./components/Vehiculos/EditarVehiculo";
import EditarTipoLavado from "./components/TiposLavado/EditarTipoLavado";
import EditarEmpleado from "./components/Empleados/EditarEmpleado";
import EditarLavados from "./components/Lavados/EditarLavados";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { AuthProvider } from "./context/AuthContext";

function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/"

  return (
    <AuthProvider>
      {!isLoginPage && <NavBar />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<PrivateRoute element={Home} />} />
        <Route path="/clientes" element={<PrivateRoute element={Clientes} />} />
        <Route path="/cliente-nuevo" element={<PrivateRoute element={FormCliente} />} />
        <Route path="/clientes/:id" element={<PrivateRoute element={EditarCliente} />} />
        <Route path="/empleados" element={<PrivateRoute element={Empleados} />} />
        <Route path="/empleado-nuevo" element={<PrivateRoute element={FormEmpleado} />} />
        <Route path="/empleados/:id" element={<PrivateRoute element={EditarEmpleado} />} />
        <Route path="/vehiculos" element={<PrivateRoute element={Vehiculos} />} />
        <Route path="/vehiculo-nuevo" element={<PrivateRoute element={FormVehiculo} />} />
        <Route path="/vehiculos/:id" element={<PrivateRoute element={EditarVehiculo} />} />
        <Route path="/tipos-lavados" element={<PrivateRoute element={TiposLavados} />} />
        <Route path="/tipos-lavado-nuevo" element={<PrivateRoute element={FormTiposLavado} />} />
        <Route path="/tipos-lavados/:id" element={<PrivateRoute element={EditarTipoLavado} />} />
        <Route path="/lavados" element={<PrivateRoute element={Lavados} />} />
        <Route path="/lavado-nuevo" element={<PrivateRoute element={FormLavado} />} />
        <Route path="/lavados/:id" element={<PrivateRoute element={EditarLavados} />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;