import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getVehiculoById, updateVehiculo } from "../../services/api";
import "../../styles/vehiculos/EditarVehiculo.css";

const EditarVehiculo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehiculo, setVehiculo] = useState(null);

  useEffect(() => {
    const fetchVehiculo = async () => {
      const response = await getVehiculoById(id);
      setVehiculo(response.data);
    };
    fetchVehiculo();
  }, [id]);

  const handleChange = (e) => {
    console.log(vehiculo);
    setVehiculo({
      ...vehiculo,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateVehiculo(id, vehiculo);
    navigate("/vehiculos");
  };

  if (!vehiculo) return <div>Cargando...</div>;

  return (
    <div className="container">
      <h1>Editar Vehiculo</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="marca"
          value={vehiculo.marca}
          onChange={handleChange}
        />
        <input
          type="text"
          name="modelo"
          value={vehiculo.modelo}
          onChange={handleChange}
        />
        <input
          type="text"
          name="matricula"
          value={vehiculo.matricula}
          onChange={handleChange}
        />
        <input
          type="text"
          name="color"
          value={vehiculo.color}
          onChange={handleChange}
        />
        <select
          name="tipo"
          value={vehiculo.tipo}
          id="tipo"
          onChange={handleChange}
        >
          <option value="Auto">Auto</option>
          <option value="Camioneta">Camioneta</option>
          <option value="Furgon">Furgon</option>
          <option value="Moto">Moto</option>
          <option value="Camion">Camión</option>
        </select>
        <button type="submit">Guardar</button>
      </form>
    </div>
  );
};

export default EditarVehiculo;
