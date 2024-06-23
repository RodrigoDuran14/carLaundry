import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEmpleadoById, updateEmpleado } from "../../services/api";
import { toast } from "react-toastify";
import "../../styles/empleados/editarEmpleado.css";

const EditarEmpleado = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [empleado, setEmpleado] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    try {
        const fetchEmpleado = async () => {
        const response = await getEmpleadoById(id);
        setEmpleado(response.data);
      };
      fetchEmpleado();
    } catch (error) {
      toast.error("Error al cargar Empleados");
    }
  }, [id]);

  const handleChange = (e) => {
    setEmpleado({
      ...empleado,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
    await updateEmpleado(id, empleado);
    toast.success("Empleado actualizado correctamente")
    navigate("/empleados");
    } catch (error) {
      toast.error("Error al actualizar Empleado")
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  if (!empleado) return <div>Cargando...</div>;
  return (
    <div className="container">
      <h1>Editar Empleado</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="nombre"
          value={empleado.nombre}
          onChange={handleChange}
        />
        <input
          type="number"
          name="dni"
          value={empleado.dni}
          onChange={handleChange}
        />
        <input
          type="text"
          name="mail"
          value={empleado.mail}
          onChange={handleChange}
        />
        <input
          type="number"
          name="celular"
          value={empleado.celular}
          onChange={handleChange}
        />
        {empleado.admin && (
          <div>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={empleado.password}
              onChange={handleChange}
            />
            <button type="button" onClick={toggleShowPassword}>
              {showPassword ? "Ocultar" : "Mostrar"} Contraseña
            </button>
          </div>
        )}
        <button type="submit">Actualizar</button>
      </form>
    </div>
  );
};

export default EditarEmpleado;
