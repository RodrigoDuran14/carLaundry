import React, { useState } from "react";
import { postEmpleado } from "../../services/api";
import { toast } from "react-toastify";
import "../../styles/empleados/formEmpleado.css"

const FormEmpleado = ({ onCreate }) => {
  const [form, setForm] = useState({
    nombre: "",
    dni: 0,
    celular: 0,
    mail: "",
  });


  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      await postEmpleado(form);
      onCreate();
      toast.success("Nuevo empleado creado con exito")
    } catch (error) {
      toast.error("Error al crear nuevo Empleado")
    }
  };

  return (
    <div className="form-container">
      <h2>Nuevo Empleado</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="nombre"
          type="text"
          placeholder="Nombre"
          onChange={handleChange}
        />
        <input
          name="dni"
          type="number"
          placeholder="DNI"
          onChange={handleChange}
        />
        <input
          name="mail"
          type="text"
          placeholder="Mail"
          onChange={handleChange}
        />
        <input
          name="celular"
          type="number"
          placeholder="Celular"
          onChange={handleChange}
        />
        <button type="submit">Agregar Empleado</button>
      </form>
    </div>
  );
};

export default FormEmpleado;
