import React, { useState, useEffect } from "react";
import { getVehiculoList, updateActiveVehiculo } from "../services/api";
import BuscadorVehiculoCompleto from "../components/Vehiculos/BuscadorVehiculoCompleto";
import FormVehiculo from "../components/Vehiculos/FormVehiculo";
import { useNavigate } from "react-router-dom";
import "../styles/vehiculos/Vehiculos.css";

const Vehiculos = () => {
  const [vehiculos, setVehiculos] = useState([]);
  const [vehiculosEliminados, setVehiculosEliminados] = useState([]);
  const [showEliminados, setShowEliminados] = useState(false);
  const [showFormVehiculo, setShowFormVehiculo] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadVehiculos();
  }, []);

  const loadVehiculos = async () => {
    const response = await getVehiculoList();
    setVehiculos(response.data.filter((v) => v.activo));
    setVehiculosEliminados(response.data.filter((v) => !v.activo));
  };

  const handleSearchResult = (result) => {
    setVehiculos(result.filter((v) => v.activo));
    setVehiculosEliminados(result.filter((v) => !v.activo));
  };

  const handleChangeActive = async (id) => {
    await updateActiveVehiculo(id);
    loadVehiculos();
  };

  const handleCreate = () => {
    loadVehiculos();
  };

  const handleAddVehiculoClick = () => {
    setShowFormVehiculo(!showFormVehiculo);
  };

  return (
    <div className="container">
      <div>
        <h1>Vehiculos</h1>
        <div className="buscador-container">
          <BuscadorVehiculoCompleto onResult={handleSearchResult} />
          <button className="add-client-btn" onClick={handleAddVehiculoClick}>
            {showFormVehiculo ? "Ocultar Formulario" : "Agregar Vehiculo"}
          </button>
        </div>

        {showFormVehiculo && (
          <div className="form-container">
            <FormVehiculo onCreate={handleCreate} />
          </div>
        )}
      </div>

      <div className="tables">
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
            {vehiculos.map((v) => (
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
                  <button onClick={() => handleChangeActive(v._id)}>
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
          {showEliminados ? "Ocultar" : "Mostrar"} Vehiculos Eliminados
        </button>
        {showEliminados && (
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
              {vehiculosEliminados.map((v) => (
                <tr key={v._id}>
                  <td>{v.marca}</td>
                  <td>{v.modelo}</td>
                  <td>{v.matricula}</td>
                  <td>{v.color}</td>
                  <td>{v.tipo}</td>
                  <td>
                    <button onClick={() => handleChangeActive(v._id)}>
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

export default Vehiculos;
