import React, { useState } from "react";
import { postTipoLavado } from "../../services/api";
import "../../styles/tiposLavado/FormTiposLavado.css"

const FormTiposLavado = ({ onCreate }) => {
  const [form, setForm] = useState({
    titulo: "",
    descripcion: "",
    precio: 0,
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await postTipoLavado(form);
    onCreate();
  };

  return (
    <div className="form-container">
      <h2>Nuevo Tipo de Lavado</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="titulo"
          type="text"
          placeholder="Titulo"
          onChange={handleChange}
        />
        <input
          name="descripcion"
          type="text"
          placeholder="Descripcion"
          onChange={handleChange}
        />
        <input
          name="precio"
          type="number"
          placeholder="Precio"
          onChange={handleChange}
        />
        <button type="submit">Agregar Tipo de Lavado</button>
      </form>
    </div>
  );
};

export default FormTiposLavado;
