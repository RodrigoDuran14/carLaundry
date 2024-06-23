import { Route, Routes } from "react-router-dom";
import "./App.css";
import NavBar from "./components/NavBar";
import Clientes from "./pages/Clientes";
import Empleados from "./pages/Empleados";
import Vehiculos from "./pages/Vehiculos";
import TiposLavados from "./pages/TiposLavados";
import Lavados from "./pages/Lavados";
import EditarCliente from "./components/Clientes/EditarCliente";
import EditarVehiculo from "./components/Vehiculos/EditarVehiculo";
import FormCliente from "./components/Clientes/FormCliente";
import FormVehiculo from "./components/Vehiculos/FormVehiculo";
import EditarTipoLavado from "./components/TiposLavado/EditarTipoLavado";
import EditarEmpleado from "./components/Empleados/EditarEmpleado";

function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/clientes" element={<Clientes />} />
        <Route path="/cliente-nuevo" element={<FormCliente />} />
        <Route path="/clientes/:id" element={<EditarCliente />} />
        <Route path="/empleados" element={<Empleados />} />
        <Route path="/empleados/:id" element={<EditarEmpleado />} />
        <Route path="/vehiculos" element={<Vehiculos />} />
        <Route path="/vehiculo-nuevo" element={<FormVehiculo />} />
        <Route path="/vehiculos/:id" element={<EditarVehiculo />} />
        <Route path="/tipos-lavados" element={<TiposLavados />} />
        <Route path="/tipos-lavados/:id" element={<EditarTipoLavado />} />
        <Route path="/lavados" element={<Lavados />} />
      </Routes>
    </>
  );
}

export default App;
