import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getClientById, updateClient, addVehiculo } from "../../services/api";
import { toast } from "react-toastify";
import BuscadorVehiculos from "../Vehiculos/BuscadorVehiculos"
import "../../styles/clientes/EditarCliente.css";

const EditarCliente = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cliente, setCliente] = useState(null);
  const [showBuscador, setShowBuscador] = useState(false);

  useEffect(() => {
    try {
      const fetchCliente = async () => {
        const response = await getClientById(id);
        setCliente(response.data);
      };
      fetchCliente();
    } catch (error) {
      toast.error("Error al cargar cliente")
    }
  }, [id]);

  const handleChange = (e) => {
    setCliente({
      ...cliente,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
    await updateClient(id, cliente);
    toast.success("Cliente actualizado correctamente")
    navigate("/clientes");
    } catch (error) {
      toast.error("Error al actualizar cliente")
    }
  };

  const handleSelectVehiculo = async (vehiculo) => {
    if (!vehiculo._id) {
      toast.error("El ID del vehículo es inválido");
      return;
    }
  
    try {
      await addVehiculo(id, vehiculo._id);
      setCliente((prevCliente) => ({
        ...prevCliente,
        vehiculo: [...prevCliente.vehiculo, vehiculo],
      }));
      toast.success("Vehículo agregado correctamente");
      setShowBuscador(false); // Oculta el BuscadorVehiculos después de seleccionar un vehículo
    } catch (error) {
      toast.error("Error al agregar vehículo");
    }
  };

  if (!cliente) return <div>Cargando...</div>;

  return (
    <div className="container">
      <h1>Editar Cliente</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="nombre"
          value={cliente.nombre}
          onChange={handleChange}
        />
        <input
          type="number"
          name="dni"
          value={cliente.dni}
          onChange={handleChange}
        />
        <input
          type="number"
          name="celular"
          value={cliente.celular}
          onChange={handleChange}
        />
        <input
          type="text"
          name="mail"
          value={cliente.mail}
          onChange={handleChange}
        />
        <button type="submit">Guardar</button>
      </form>

    <h3>Vehiculos</h3>
      <table>
        <thead>
          <tr>
            <th>Marca</th>
            <th>Modelo</th>
            <th>Matricula</th>
            <th>Color</th>
            <th>Tipo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {cliente.vehiculo.map((v) => (
            <tr key={v._id}>
              <td>{v.marca}</td>
              <td>{v.modelo}</td>
              <td>{v.matricula}</td>
              <td>{v.color}</td>
              <td>{v.tipo}</td>
              <td>
                <button onClick={() => navigate(`/vehiculos/${v._id}`)}>
                  Editar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="btn" onClick={() => setShowBuscador(!showBuscador)}>
        {showBuscador ? "Cerrar Buscador" : "Agregar Vehiculo"}
      </button>
      {showBuscador && <div className="buscador-containercliente"><BuscadorVehiculos onSelect={handleSelectVehiculo} /></div>}
    </div>
  );
};

export default EditarCliente;
