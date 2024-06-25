import React, { useState } from "react";
import { findLavadoByDate } from "../../services/api";
import { toast } from "react-toastify";
import "../../styles/lavados/BuscadorLavadosPorFecha.css";

const BuscadorLavadosPorFecha = () => {
  const [fecha, setFecha] = useState("");
  const [lavados, setLavados] = useState([]);
  const [totalVentas, setTotalVentas] = useState(0);

  const handleChange = (e) => {
    setFecha(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(fecha)
    try {
      const response = await findLavadoByDate({fecha});
      setLavados(response.data[0]);
      setTotalVentas(response.data[1]);
      if (response.data[0].length === 0) {
        toast.info("No se encontraron lavados para la fecha seleccionada");
      }
    } catch (error) {
      toast.error("Error al buscar Lavados");
    }
  };

  return (
    <div className="buscadorfecha-container">
      <form onSubmit={handleSubmit} className="formFecha">
        <label htmlFor="fecha">Fecha: </label>
        <input
          type="date"
          name="fecha"
          id="fecha"
          value={fecha}
          onChange={handleChange}
          required
        />
        <button type="submit">Buscar</button>
      </form>

      {totalVentas > 0 && (
        <div className="ventas-section">
          <h2>Ventas Totales por Día</h2>
          <p>Total de Ventas:  ${totalVentas}</p>
        </div>
      )}

      {lavados.length > 0 && (
        <div className="tables">
          <h2>Resultados de la Busqueda</h2>
          <table>
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Vehículo</th>
                <th>Lavador</th>
                <th>Tipo de Lavado</th>
                <th>Horario Inicio</th>
                <th>Horario Fin</th>
                <th>Total</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {lavados.map((lavado) => (
                <tr key={lavado._id}>
                  <td>{lavado.clienteId.nombre}</td>
                  <td>
                    {lavado.vehiculoId.marca} {lavado.vehiculoId.modelo} (
                    {lavado.vehiculoId.matricula})
                  </td>
                  <td>{lavado.lavador.map((l) => l.nombre).join(", ")}</td>
                  <td>{lavado.tipoLavado.map((t) => t.titulo).join(", ")}</td>
                  <td>{new Date(lavado.horarioInicio).toLocaleString()}</td>
                  <td>{lavado.horarioFin ? new Date(lavado.horarioFin).toLocaleString() : "N/A"}</td>
                  <td>{lavado.total}</td>
                  <td>{lavado.estadoDelLavado}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BuscadorLavadosPorFecha;
