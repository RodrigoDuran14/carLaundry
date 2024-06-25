import React, { useState, useEffect } from "react";
import {
  getLavadoList,
  updateActiveLavado,
  inicioLavado,
  finalizarLavado,
} from "../services/api";
import BuscadorLavados from "../components/Lavados/BuscadorLavados";
import FormLavado from "../components/Lavados/FormLavado";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../styles/lavados/lavados.css";

const Lavados = () => {
  const [lavados, setLavados] = useState([]);
  const [lavadosEliminados, setLavadosEliminados] = useState([]);
  const [showEliminados, setShowEliminados] = useState(false);
  const [showFormLavados, setShowFormLavados] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadLavados();
  }, []);

  const loadLavados = async () => {
    try {
      const response = await getLavadoList();
      setLavados(response.data.filter((l) => l.activo));
      setLavadosEliminados(response.data.filter((l) => !l.activo));
    } catch (error) {
      toast.error("Error al cargar Lavados");
    }
  };

  const handleSearchResult = (result) => {
    setLavados(result.filter((l) => l.activo));
    setLavadosEliminados(result.filter((l) => !l.activo));
  };

  const handleChangeActive = async (id) => {
    try {
      await updateActiveLavado(id);
      loadLavados();
      toast.success("Estado del Lavado actualizado correctamente");
    } catch (error) {
      toast.error("Error al actualizar el estado del Lavado");
    }
  };

  const handleCreate = () => {
    loadLavados();
  };

  const handleAddLavadoClick = () => {
    setShowFormLavados(!showFormLavados);
  };

  return (
    <div className="container">
      <div>
        <h1>Lavados</h1>
        <div className="buscador-container">
          <BuscadorLavados onResult={handleSearchResult} />
          <button className="add-lavados-btn" onClick={handleAddLavadoClick}>
            {showFormLavados ? "Ocultar Formulario" : "Agregar Lavado"}
          </button>
        </div>
        {showFormLavados && (
          <div className="form-container">
            <FormLavado onCreate={handleCreate} />
          </div>
        )}
      </div>
      <div className="tables">
        <table>
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Vehiculo</th>
              <th>Estado</th>
              <th>Tipo de Lavado</th>
              <th>Lavador</th>
              <th>Horario Inicio</th>
              <th>Horario Fin</th>
              <th>total</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {lavados.map((l) => (
              <tr key={l._id}>
                <td>{l.clienteId.nombre}</td>
                <td>
                  {l.vehiculoId.modelo} - {l.vehiculoId.matricula}
                </td>
                <td>{l.estadoDelLavado}</td>
                <td>{l.tipoLavado.map((t) => t.titulo).join(", ")}</td>
                <td>{l.lavador.map((la) => la.nombre).join(", ")}</td>
                <td>
                  {l.horarioInicio
                    ? new Date(l.horarioInicio).toLocaleString()
                    : " "}
                </td>
                <td>
                  {l.horarioFin ? new Date(l.horarioFin).toLocaleString() : " "}
                </td>
                <td>{l.total}</td>
                <td>
                  <button onClick={() => navigate(`/lavados/${l._id}`)}>
                    Editar
                  </button>
                  <button onClick={() => handleChangeActive(l._id)}>
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
          {showEliminados ? "Ocultar" : "Mostrar"} Lavados Eliminados
        </button>
        {showEliminados.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Vehiculo</th>
                <th>Estado</th>
                <th>Tipo de Lavado</th>
                <th>Lavador</th>
                <th>Horario Inicio</th>
                <th>Horario Fin</th>
                <th>total</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {lavadosEliminados.map((l) => (
                <tr key={l._id}>
                  <td>{l.clienteId.nombre}</td>
                  <td>
                    {l.vehiculoId.modelo} - {l.vehiculoId.matricula}
                  </td>
                  <td>{l.estadoDelLavado}</td>
                  <td>{l.tipoLavado.map((t) => t.titulo).join(", ")}</td>
                  <td>{l.lavador.map((l) => l.nombre).join(", ")}</td>
                  <td>{new Date(l.horarioInicio).toLocaleString()}</td>
                  <td>{new Date(l.horarioFin).toLocaleString()}</td>
                  <td>{l.total}</td>
                  <td>
                    <button onClick={() => handleChangeActive(l._id)}>
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

export default Lavados;
