import React, { useState } from "react";
import { findLavadoByDate } from "../../services/api";
import { toast } from "react-toastify";

const BuscadorLavadosPorFecha = ({ onResult }) => {
  const [fecha, setFecha] = useState("");
  const [lavados, setLavados] = useState([]);

  const handleChange = (e) => {
    setFecha(e.target.value);
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const response = await findLavadoByDate(fecha);
      setLavados(response);
      if (response.length === 0) {
        toast.info("No se encontraron lavados para la fecha seleccionada");
      }
      onResult(response.data);
    } catch (error) {
      toast.error("Error al buscar Lavados");
    }
  };
  return (
    <div className="buscador-container">
      <form onSubmit={handleSubmit}>
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
    </div>
  );
};

export default BuscadorLavadosPorFecha;
