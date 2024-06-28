import React, { useState, useEffect } from "react";
import {
  getEmpleadoList,
  updateActiveEmpleado,
  updateAdminEmpleado,
  createPassword,
} from "../services/api";
import { useNavigate } from "react-router-dom";
import BuscadorEmpleados from "../components/Empleados/BuscadorEmpleado";
import FormEmpleado from "../components/Empleados/FormEmpleado";
import { toast } from "react-toastify";
import "../styles/empleados/empleados.css";

const Empleados = () => {
  const [empleados, setEmpleados] = useState([]);
  const [empleadosEliminados, setEmpleadosEliminados] = useState([]);
  const [empleadosAdmin, setEmpleadosAdmin] = useState([]);
  const [showEliminados, setShowEliminados] = useState(false);
  const [showAdmins, setShowAdmins] = useState(false);
  const [showFormEmpleado, setShowFormEmpleado] = useState(false);
  const [showFormPassword, setShowFormPassword] = useState({});
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    loadEmpleados();
  }, []);

  const loadEmpleados = async () => {
    try {
      const response = await getEmpleadoList();
      setEmpleados(response.data.filter((e) => e.activo));
      setEmpleadosEliminados(response.data.filter((e) => !e.activo));
      setEmpleadosAdmin(response.data.filter((e) => e.activo && e.admin));
    } catch (error) {
      toast.error("Error al cargar Empleados");
    }
  };

  const handleSearchResult = (result) => {
    setEmpleados(result.filter((e) => e.activo));
    setEmpleadosEliminados(result.filter((e) => !e.activo));
    setEmpleadosAdmin(result.filter((e) => e.activo && e.admin));
  };

  const handleChangeActive = async (id) => {
    try {
      await updateActiveEmpleado(id);
      loadEmpleados();
      toast.success("Estado del Empleado actualizado correctamente");
    } catch (error) {
      toast.error("Error al actualizar el estado del Empleado");
    }
  };

  const handleChangeAdmin = async (id) => {
    try {
      await updateAdminEmpleado(id);
      loadEmpleados();
      toast.success("Estado de administrador actualizado correctamente");
    } catch (error) {
      toast.error("Error al actualizar el estado de administrador");
    }
  };

  const handleCreate = () => {
    loadEmpleados();
    setShowFormEmpleado(!showFormEmpleado);
  };

  const handleAddEmpleadoClick = () => {
    setShowFormEmpleado(!showFormEmpleado);
  };

  const handleShowPasswordForm = (id) => {
    setShowFormPassword((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handlePasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleSubmitPassword = async (id) => {
    try {
      await createPassword(id, { password: newPassword });
      toast.success("Contraseña actualizada con exito")
      setShowFormPassword({});
      setNewPassword("");
      loadEmpleados();
    } catch (error) {
      toast.error("Error al actualizar la contraseña");
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="container">
      <div>
        <h1>Empleados</h1>
        <div className="buscador-container">
          <BuscadorEmpleados onResult={handleSearchResult} />
          <button className="add-empleado-btn" onClick={handleAddEmpleadoClick}>
            {showFormEmpleado ? "Ocultar Formulario" : "Agregar Empleado"}
          </button>
        </div>
        {showFormEmpleado && (
          <div className="form-container">
            <FormEmpleado onCreate={handleCreate} />
          </div>
        )}
      </div>
      <div className="tables">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>DNI</th>
              <th>Mail</th>
              <th>Celular</th>
              <th>Admin</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {empleados.map((e) => (
              <tr key={e._id}>
                <td>{e.nombre}</td>
                <td>{e.dni}</td>
                <td>{e.mail}</td>
                <td>{e.celular}</td>
                <td>{e.admin ? "Sí" : "No"}</td>
                <td>
                  <button onClick={() => navigate(`/empleados/${e._id}`)}>
                    Editar
                  </button>
                  <button onClick={() => handleChangeActive(e._id)}>
                    Eliminar
                  </button>
                  {!e.admin && (
                    <button onClick={() => handleChangeAdmin(e._id)}>
                      Dar Admin
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="containerEliminados">
        <button onClick={() => setShowEliminados(!showEliminados)}>
          {showEliminados ? "Ocultar" : "Mostrar"} Empleados Eliminados
        </button>
        {showEliminados && (
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>DNI</th>
                <th>Mail</th>
                <th>Celular</th>
                <th>Admin</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {empleadosEliminados.map((e) => (
                <tr key={e._id}>
                  <td>{e.nombre}</td>
                  <td>{e.dni}</td>
                  <td>{e.mail}</td>
                  <td>{e.celular}</td>
                  <td>{e.admin ? "Sí" : "No"}</td>
                  <td>
                    <button onClick={() => handleChangeActive(e._id)}>
                      Activar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <div className="containerEliminados">
        <button onClick={() => setShowAdmins(!showAdmins)}>
          {showAdmins ? "Ocultar" : "Mostrar"} Empleados Administradores
        </button>
        {showAdmins && (
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>DNI</th>
                <th>Mail</th>
                <th>Celular</th>
                <th>Admin</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {empleadosAdmin.map((e) => (
                <tr key={e._id}>
                  <td>{e.nombre}</td>
                  <td>{e.dni}</td>
                  <td>{e.mail}</td>
                  <td>{e.celular}</td>
                  <td>{e.admin ? "Sí" : "No"}</td>
                  <td>
                    <button onClick={() => handleChangeAdmin(e._id)}>
                      Quitar Admin
                    </button>
                    {!e.password && (
                      <button onClick={() => handleShowPasswordForm(e._id)}>
                        {showFormPassword[e._id]
                          ? "Ocultar Formulario"
                          : "Crear contraseña"}
                      </button>
                    )}
                    {showFormPassword[e._id] && (
                      <div>
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="Crear Contraseña"
                          value={newPassword}
                          onChange={handlePasswordChange}
                        />
                        <button type="button" onClick={toggleShowPassword}>
                          {showPassword ? "Ocultar" : "Mostrar"} Contraseña
                        </button>
                        <button onClick={() => handleSubmitPassword(e._id)}>
                          Crear Contraseña
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Empleados;
