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
  const [showFormPassword, setShowFormPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");

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
      if (empleado.admin && showFormPassword && !newPassword) {
        toast.error("La contraseña no puede quedar en blanco");
        return;
      }
      if (!empleado.nombre || !empleado.dni || !empleado.celular || !empleado.mail) {
        toast.error("Todos los campos son obligatorios");
        return;
      }

      const updatedEmpleado = {...empleado}
      if(showFormPassword){
        updatedEmpleado.password = newPassword
      }

    await updateEmpleado(id, updatedEmpleado);
    toast.success("Empleado actualizado correctamente")
    navigate("/empleados");
    } catch (error) {
      toast.error("Error al actualizar Empleado")
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleShowFormPassword = ()=> {
    setShowFormPassword(!showFormPassword)
    setNewPassword("");
  }

  const handlePassword = (e)=>{
    setNewPassword(e.target.value)
  }

  if (!empleado) return <div>Cargando...</div>;
  return (
    <div className="container">
      <h1>Editar Empleado</h1>
      <form onSubmit={handleSubmit}>
        <label>Nombre</label>
        <input
          type="text"
          name="nombre"
          value={empleado.nombre}
          onChange={handleChange}
        />
        <label>DNI</label>
        <input
          type="number"
          name="dni"
          value={empleado.dni}
          onChange={handleChange}
        />
        <label>Mail</label>
        <input
          type="text"
          name="mail"
          value={empleado.mail}
          onChange={handleChange}
        />
        <label>Celular</label>
        <input
          type="number"
          name="celular"
          value={empleado.celular}
          onChange={handleChange}
        />
        {empleado.admin && (
          <button type="button" onClick={handleShowFormPassword}>
            {!showFormPassword ? "Cambiar contraseña": "Ocultar"}
          </button>
        )}
        {showFormPassword && (
          <div>
          <p>Nueva Contraseña</p>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={newPassword}
            onChange={handlePassword}
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
