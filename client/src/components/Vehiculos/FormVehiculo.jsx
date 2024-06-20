import React, { useState } from "react";
import { postVehiculo } from "../../services/api";
import "../../styles/vehiculos/FormVehiculos.css"

const FormVehiculo = ({ onCreate }) => {
  const [form, setForm] = useState({
    marca: "",
    modelo: "",
    matricula: "",
    color: "",
    tipo: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await postVehiculo(form);
    onCreate();
  };

  return (
    <div className="form-container">
      <h2>Nuevo Vehiculo</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="marca"
          type="text"
          placeholder="Marca"
          onChange={handleChange}
        />
        <input
          name="modelo"
          type="text"
          placeholder="Modelo"
          onChange={handleChange}
        />
        <input
          name="matricula"
          type="text"
          placeholder="Matricula"
          onChange={handleChange}
        />
        <input
          name="color"
          type="text"
          placeholder="Color"
          onChange={handleChange} 
        />
        <select name="tipo" id="tipo" onChange={handleChange}>
          <option value="Auto">Auto</option>
          <option value="Camioneta">Camioneta</option>
          <option value="Furgon">Furgon</option>
          <option value="Moto">Moto</option>
          <option value="Camion">Camión</option>
        </select>
        <button type="submit">Agregar Vehiculo</button>
      </form>
    </div>
  );
};

export default FormVehiculo;
