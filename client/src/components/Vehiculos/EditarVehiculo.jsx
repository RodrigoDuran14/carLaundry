import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getVehiculoById, updateVehiculo } from "../../services/api";
import { toast } from "react-toastify";
import "../../styles/vehiculos/EditarVehiculo.css";

const EditarVehiculo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehiculo, setVehiculo] = useState(null);

  useEffect(() => {
    try {
        const fetchVehiculo = async () => {
        const response = await getVehiculoById(id);
        setVehiculo(response.data);
      };
      fetchVehiculo();
    } catch (error) {
      toast.error("Error al cargar Vehiculo");
    }
  }, [id]);

  const handleChange = (e) => {
    console.log(vehiculo);
    setVehiculo({
      ...vehiculo,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      await updateVehiculo(id, vehiculo);
      toast.success("Vehiculo actualizado correctamente");
      navigate("/vehiculos");
    } catch (error) {
      toast.error("Error al actualizar Vehiculo");
    }
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
