import { Route, Routes, Navigate } from "react-router-dom";
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
import { useAuth } from "./context/AuthContext";

function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/clientes" element={<Clientes />} />
        <Route path="/cliente-nuevo" element={<FormCliente />} />
        <Route path="/clientes/:id" element={<EditarCliente />} />
        <Route path="/empleados" element={<Empleados />} />
        <Route path="/empleado-nuevo" element={<FormEmpleado />} />
        <Route path="/empleados/:id" element={<EditarEmpleado />} />
        <Route path="/vehiculos" element={<Vehiculos />} />
        <Route path="/vehiculo-nuevo" element={<FormVehiculo />} />
        <Route path="/vehiculos/:id" element={<EditarVehiculo />} />
        <Route path="/tipos-lavados" element={<TiposLavados />} />
        <Route path="/tipos-lavado-nuevo" element={<FormTiposLavado />} />
        <Route path="/tipos-lavados/:id" element={<EditarTipoLavado />} />
        <Route path="/lavados" element={<Lavados />} />
        <Route path="/lavado-nuevo" element={<FormLavado />} />
        <Route path="/lavados/:id" element={<EditarLavados />} />
      </Routes>
    </>
  );
}

export default App;
