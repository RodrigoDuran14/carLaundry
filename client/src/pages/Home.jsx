import React, { useState, useEffect } from "react";
import { getLavadoList, finalizarLavado, updateActiveLavado, notificar, getEmpleadoList, inicioLavado } from "../services/api";
import { toast } from "react-toastify";
import BuscadorLavadosPorFecha from "../components/Lavados/BuscadorLavadosPorFecha";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import "../styles/other/home.css";

const Home = () => {
  const [lavados, setLavados] = useState([]);
  const [lavadoPendiente, setLavadoPendiente] = useState([]);
  const [lavadoEnProgreso, setLavadoEnProgreso] = useState([]);
  const [lavadoTerminado, setLavadoTerminado] = useState([]);
  const [showPendiente, setShowPendiente] = useState(false);
  const [showEnProgreso, setShowEnProgreso] = useState(false);
  const [showTerminado, setShowTerminado] = useState(false);
  const [showIniciarForms, setShowIniciarForms] = useState([]);
  const [notificado, setNotificado] = useState({});
  const [lavadores, setLavadores] = useState([]);
  const [selectedLavadores, setSelectedLavadores] = useState([]);
  const [currentLavadoId, setCurrentLavadoId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    loadLavados();
  }, []);

  useEffect(() => {
    const fetchLavadores = async () => {
      try {
        const response = await getEmpleadoList();
        setLavadores(response.data);
      } catch (error) {
        toast.error("Error al cargar lavadores");
      }
    };

    fetchLavadores();
  }, []);

  const loadLavados = async () => {
    try {
      const response = await getLavadoList();
      const lavadosData = response.data;
      setLavados(lavadosData);
      setLavadoPendiente(
        lavadosData.filter((l) => l.estadoDelLavado === "Pendiente")
      );
      setLavadoEnProgreso(
        lavadosData.filter((l) => l.estadoDelLavado === "En progreso")
      );
      setLavadoTerminado(
        lavadosData.filter((l) => l.estadoDelLavado === "Terminado")
      );
    } catch (error) {
      toast.error("Error al cargar los datos");
    }
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

  const finLavados = async (id) => {
    try {
      await finalizarLavado(id);
      loadLavados();
      toast.success("Lavado terminado correctamente");
    } catch (error) {
      toast.error("Error al terminar el Lavado");
    }
  };

  const handleShowPendiente = () => {
    setShowPendiente(!showPendiente);
  };

  const handleShowEnProgreso = () => {
    setShowEnProgreso(!showEnProgreso);
  };

  const handleShowTerminado = () => {
    setShowTerminado(!showTerminado);
  };

  const handleIniciar = (id) => {
    setCurrentLavadoId(id);
    setShowIniciarForms((prevForms) => {
      if (prevForms.includes(id)) {
        return prevForms.filter((formId) => formId !== id);
      } else {
        return [...prevForms, id];
      }
    });
  };

  const handleNotificar = async (id) => {
    try {
      await notificar(id);
      toast.success("Notificacion enviada con exito");
      setNotificado((prevNotificados) => ({
        ...prevNotificados,
        [id]: true,
      }));
    } catch (error) {
      toast.error("Error al notificar al cliente");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedLavadores.length === 0) {
        toast.error("Por favor seleccione al menos un elemento");
        return;
      }

      const lavadoresIds = selectedLavadores.map((l) => l.value);
      console.log("Lavadores seleccionados:", lavadoresIds);

      const newLavador = {
        lavadores: lavadoresIds
      }

      await inicioLavado(currentLavadoId, newLavador);
      toast.success("Lavado iniciado con éxito");
      setShowIniciarForms([]);
      setSelectedLavadores([]);
      loadLavados();
    } catch (error) {
      console.error("Error al iniciar lavado:", error);
      toast.error("Error al iniciar lavado");
    }
  };

  return (
    <div className="container">
      <h1>Inicio</h1>

      <div className="buscador-container">
        <BuscadorLavadosPorFecha />
      </div>

      <div className="buttons-section">
        <button onClick={handleShowPendiente}>
          Lavados Pendientes
        </button>
        <button onClick={handleShowEnProgreso}>Lavados En Progreso</button>
        <button onClick={handleShowTerminado}>Lavados Terminado</button>

        {showPendiente && (
          <>
            {lavadoPendiente.length > 0 && (
              <div className="tables">
                <h2>Lavados Pendientes</h2>
                <table>
                  <thead>
                    <tr>
                      <th>Cliente</th>
                      <th>Vehículo</th>
                      <th>Tipo de Lavado</th>
                      <th>Total</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lavadoPendiente.map((l) => (
                      <tr key={l._id}>
                        <td>{l.clienteId.nombre}</td>
                        <td>
                          {l.vehiculoId.marca} {l.vehiculoId.modelo}{" "}
                          {l.vehiculoId.matricula}
                        </td>
                        <td>{l.tipoLavado.map((t) => t.titulo).join(", ")}</td>
                        <td>{l.total}</td>
                        <td>{l.estadoDelLavado}</td>
                        <td>
                          <button onClick={() => handleIniciar(l._id)}>
                            {showIniciarForms.includes(l._id)
                              ? "Ocultar Formulario"
                              : "Iniciar Lavado"}
                          </button>
                          {showIniciarForms.includes(l._id) && (
                            <div>
                              <div className='iniciar-lavado-form'>
                                <h2>Seleccionar Lavadores</h2>
                                <form onSubmit={handleSubmit}>
                                  <div>
                                    <label>Lavadores:</label>
                                    <Select
                                      isMulti
                                      value={selectedLavadores}
                                      onChange={setSelectedLavadores}
                                      options={lavadores.map(lavador => ({
                                        value: lavador._id,
                                        label: lavador.nombre,
                                      }))}
                                    />
                                  </div>
                                  <button type="submit">Iniciar Lavado</button>
                                </form>
                              </div>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {showEnProgreso && (
          <>
            {lavadoEnProgreso.length > 0 && (
              <div className="tables">
                <h2>Lavados En Progreso</h2>
                <table>
                  <thead>
                    <tr>
                      <th>Cliente</th>
                      <th>Vehículo</th>
                      <th>Lavador</th>
                      <th>Tipo de Lavado</th>
                      <th>Total</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lavadoEnProgreso.map((l) => (
                      <tr key={l._id}>
                        <td>{l.clienteId.nombre}</td>
                        <td>
                          {l.vehiculoId.marca} {l.vehiculoId.modelo}{" "}
                          {l.vehiculoId.matricula}
                        </td>
                        <td>{l.lavador.map((la) => la.nombre).join(", ")}</td>
                        <td>{l.tipoLavado.map((t) => t.titulo).join(", ")}</td>
                        <td>{l.total}</td>
                        <td>{l.estadoDelLavado}</td>
                        <td>
                          <button onClick={()=>finLavados(l._id)}>
                            Finalizar Lavados
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {showTerminado && (
          <>
            {lavadoTerminado.length > 0 && (
              <div className="tables">
                <h2>Lavados Terminados</h2>
                <table>
                  <thead>
                    <tr>
                      <th>Cliente</th>
                      <th>Vehículo</th>
                      <th>Lavador</th>
                      <th>Tipo de Lavado</th>
                      <th>Total</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                      <th>Notificado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lavadoTerminado.map((l) => (
                      <tr key={l._id}>
                        <td>{l.clienteId.nombre}</td>
                        <td>
                          {l.vehiculoId.marca} {l.vehiculoId.modelo}{" "}
                          {l.vehiculoId.matricula}
                        </td>
                        <td>{l.lavador.map((la) => la.nombre).join(", ")}</td>
                        <td>{l.tipoLavado.map((t) => t.titulo).join(", ")}</td>
                        <td>{l.total}</td>
                        <td>{l.estadoDelLavado}</td>
                        <td>
                          <button onClick={() => handleNotificar(l._id)}>
                            Notificar al Cliente
                          </button>
                        </td>
                        <th>{notificado[l._id] ? "SI" : "NO"}</th>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>

      <div className="form-buttons-section">
        <button onClick={() => navigate("/cliente-nuevo")}>
          Crear Cliente
        </button>
        <button onClick={() => navigate("/empleado-nuevo")}>
          Crear Empleado
        </button>
        <button onClick={() => navigate("/vehiculo-nuevo")}>
          Crear Vehiculo
        </button>
        <button onClick={() => navigate("/tipos-lavado-nuevo")}>
          Crear Tipos de Lavado
        </button>
        <button onClick={() => navigate("/lavado-nuevo")}>Crear Lavado</button>
      </div>
    </div>
  );
};

export default Home;
