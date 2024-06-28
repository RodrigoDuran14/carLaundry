import React, { useState, useEffect } from "react";
import { getTiposLavadoList, updateActiveTiposLavado } from "../services/api";
import BuscadorTiposLavado from "../components/TiposLavado/BuscadorTiposLavado";
import FormTiposLavado from "../components/TiposLavado/FormTiposLavado";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../styles/tiposLavado/TiposLavado.css";

const TiposLavados = () => {
  const [tiposLavado, setTiposLavado] = useState([]);
  const [tiposLavadoEliminados, setTiposLavadoEliminados] = useState([]);
  const [showEliminados, setShowEliminados] = useState(false);
  const [showFormTiposLavado, setShowFormTiposLavado] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadTiposLavado();
  }, []);

  const loadTiposLavado = async () => {
    try {
      const response = await getTiposLavadoList();
      setTiposLavado(response.data.filter((t) => t.activo));
      setTiposLavadoEliminados(response.data.filter((t) => !t.activo));
    } catch (error) {
      toast.error("Error al cargar los Tipos de Lavados");
    }
  };

  const handleSearchResult = (result) => {
    setTiposLavado(result.filter((t) => t.activo));
    setTiposLavadoEliminados(result.filter((t) => !t.activo));
  };

  const handleChangeActive = async (id) => {
    try {
      await updateActiveTiposLavado(id);
      loadTiposLavado();
      toast.success("Estado del Tipo de Lavado actualizado correctamente");
    } catch (error) {
      toast.error("Error al actualizar el estado del Tipo de Lavado");
    }
  };

  const handleCreate = () => {
    loadTiposLavado();
    setShowFormTiposLavado(!showFormTiposLavado);
  };

  const handleAddTiposLavadoClick = () => {
    setShowFormTiposLavado(!showFormTiposLavado);
  };

  return (
    <div className="container">
      <div>
        <h1>Tipos de Lavados</h1>
        <div className="buscador-container">
          <BuscadorTiposLavado onResult={handleSearchResult} />
          <button className="add-tipos-btn" onClick={handleAddTiposLavadoClick}>
            {showFormTiposLavado ? "Ocultar Formulario" : "Agregar Tipo de Lavado"}
          </button>
        </div>

        {showFormTiposLavado && (
          <div className="form-container">
            <FormTiposLavado onCreate={handleCreate} />
          </div>
        )}
      </div>

      <div className="tables">
        <table>
          <thead>
            <tr>
              <th>Titulo</th>
              <th>Descripcion</th>
              <th>Precio</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {tiposLavado.map((t) => (
              <tr key={t._id}>
                <td>{t.titulo}</td>
                <td>{t.descripcion}</td>
                <td>{t.precio}</td>
                <td>
                  <button onClick={() => navigate(`/tipos-lavados/${t._id}`)}>
                    Editar
                  </button>
                  <button onClick={() => handleChangeActive(t._id)}>
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
          {showEliminados ? "Ocultar" : "Mostrar"} Tipos de Lavados Eliminados
        </button>
        {showEliminados && (
          <table>
            <thead>
              <tr>
                <th>Titulo</th>
                <th>Descripcion</th>
                <th>Precio</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {tiposLavadoEliminados.map((t) => (
                <tr key={t._id}>
                  <td>{t.titulo}</td>
                  <td>{t.descripcion}</td>
                  <td>{t.precio}</td>
                  <td>
                    <button onClick={() => handleChangeActive(t._id)}>
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

export default TiposLavados;
