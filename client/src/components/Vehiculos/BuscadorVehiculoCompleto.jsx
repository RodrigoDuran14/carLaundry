import React, { useState } from "react";
import { findVehiculo, getVehiculoList } from "../../services/api";
import "../../styles/vehiculos/BuscadorVehiculoCompleto.css"

const BuscadorVehiculoCompleto = ({ onResult }) => {
  const [search, setSearch] = useState("");
  const [searchField, setSearchField] = useState("marca");

  const handleSearch = async () => {
    let query = {};
    query[searchField] = search;
    const response = await findVehiculo(query);
    
    onResult(response.data);
  };

  return (
    <div className="buscador-container">
      <select
        name="searchField"
        value={searchField}
        id="searchField"
        onChange={(e) => setSearchField(e.target.value)}
      >
        <option value="marca">Marca</option>
        <option value="modelo">Modelo</option>
        <option value="matricula">Matricula</option>
        <option value="color">Color</option>
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

export default BuscadorVehiculoCompleto;
