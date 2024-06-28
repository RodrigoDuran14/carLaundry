import React, { useState } from "react";
import { postVehiculo } from "../../services/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Select from "react-select";
import "../../styles/vehiculos/FormVehiculos.css";

const FormVehiculo = ({ onCreate }) => {
  const [form, setForm] = useState({
    marca: "",
    modelo: "",
    matricula: "",
    color: "",
    tipo: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectChange = (selectedOption) => {
    setForm({
      ...form,
      tipo: selectedOption.value,
    });
  };

  const tipoOptions = [
    { value: "Auto", label: "Auto" },
    { value: "Camioneta", label: "Camioneta" },
    { value: "Furgon", label: "Furgon" },
    { value: "Moto", label: "Moto" },
    { value: "Camion", label: "Camion" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (
        !form.marca ||
        !form.modelo ||
        !form.matricula ||
        !form.color ||
        !form.tipo
      ) {
        toast.error("Todos los campos son obligatorios");
        return
      }
      await postVehiculo(form);
      toast.success("Nuevo Vehiculo creado con exito");
      onCreate();
      navigate("/vehiculos");
    } catch (error) {
      toast.error("Error al crear nuevo vehiculo");
    }
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
        <Select
          name="tipo"
          options={tipoOptions}
          onChange={handleSelectChange}
        />
        <button type="submit">Agregar Vehiculo</button>
      </form>
    </div>
  );
};

export default FormVehiculo;
