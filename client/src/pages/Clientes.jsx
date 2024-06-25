import React, { useState, useEffect } from "react";
import { getClientList, updateActiveClient } from "../services/api";
import BuscadorClientes from "../components/Clientes/BuscadorClientes";
import FormCliente from "../components/Clientes/FormCliente";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../styles/clientes/clientes.css";

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [clientesEliminados, setClientesEliminados] = useState([]);
  const [showEliminados, setShowEliminados] = useState(false);
  const [showFormCliente, setShowFormCliente] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadClientes();
  }, []);

  const loadClientes = async () => {
    try {
      const response = await getClientList();
      setClientes(response.data.filter((cliente) => cliente.activo));
      setClientesEliminados(response.data.filter((cliente) => !cliente.activo));
      console.log(response.data);
    } catch (error) {
      toast.error("Error al cargar Clientes");
    }
  };

  const handleSearchResult = (result) => {
    setClientes(result.filter((cliente) => cliente.activo));
    setClientesEliminados(result.filter((cliente) => !cliente.activo));
  };

  const handleChangeActive = async (id) => {
    try {
      await updateActiveClient(id);
      loadClientes();
      toast.success("Estado del Cliente actualizado correctamente");
    } catch (error) {
      toast.error("Error al actualizar el estado del Cliente");
    }
  };

  const handleCreate = () => {
    loadClientes();
  };

  const handleAddClientClick = () => {
    setShowFormCliente(!showFormCliente);
  };

  return (
    <div className="container">
      <div>
        <h1>Clientes</h1>
        <div className="buscador-container">
          <BuscadorClientes onResult={handleSearchResult} />
          <button className="add-client-btn" onClick={handleAddClientClick}>
            {showFormCliente ? "Ocultar Formulario" : "Agregar Cliente"}
          </button>
        </div>

        {showFormCliente && (
          <div className="form-container">
            <FormCliente onCreate={handleCreate} />
          </div>
        )}
      </div>

      <div className="tables">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>DNI</th>
              <th>Vehiculo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((cliente) => (
              <tr key={cliente._id}>
                <td>{cliente.nombre}</td>
                <td>{cliente.dni}</td>
                {cliente.vehiculo.map((v) => (
                  <td key={v._id}>
                    {v.marca} {v.modelo}
                  </td>
                ))}
                <td>
                  <button onClick={() => navigate(`/clientes/${cliente._id}`)}>
                    Editar
                  </button>
                  <button onClick={() => handleChangeActive(cliente._id)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="containerEliminados">
        <button onClick={() => setShowEliminados(!showEliminados)}>
          {showEliminados ? "Ocultar" : "Mostrar"} Clientes Eliminados
        </button>
        {showEliminados.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>DNI</th>
                <th>Vehiculos</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clientesEliminados.map((cliente) => (
                <tr key={cliente._id}>
                  <td>{cliente.nombre}</td>
                  <td>{cliente.dni}</td>
                  {cliente.vehiculo.map((v) => (
                    <td key={v._id}>
                      {v.marca} {v.modelo}
                    </td>
                  ))}
                  <td>
                    <button onClick={() => handleChangeActive(cliente._id)}>
                      Activar
                    </button>
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

export default Clientes;
