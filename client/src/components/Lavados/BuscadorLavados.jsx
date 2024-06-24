import React, { useState } from "react";
import { findLavado } from "../../services/api";
import { toast } from "react-toastify";
import "../../styles/lavados/BuscadorLavados.css"

const BuscadorLavados = ({ onResult }) => {
  const [search, setSearch] = useState("");
  const [searchField, setSearchField] = useState("lavador");

  const handleSearch = async () => {
    try {
      let query = {};
      query[searchField] = search;
      const response = await findLavado(query);
      if(response.data.length === 0) {
        toast.info("No se encontraron lavados con esos parametros");
      }else{
        onResult(response.data);
      }
    } catch (error) {
      toast.error("Error al buscar Lavados");
    }
  };

  return (
    <div className="buscador-container">
      <select
        name="searchField"
        value={searchField}
        id="searchField"
        onChange={(e) => setSearchField(e.target.value)}
      >
        <option value="lavador">Nombre Lavador</option>
        <option value="cliente">Nombre Cliente</option>
        <option value="matricula">Matricula vehiculo</option>
      </select>
      <input
        type="text"
        placeholder={`Buscar por ${searchField}`}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button onClick={handleSearch}>Buscar</button>
    </div>
  );
};

export default BuscadorLavados;
