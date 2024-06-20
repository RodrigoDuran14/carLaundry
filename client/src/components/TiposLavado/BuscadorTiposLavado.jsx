import React, { useState } from "react";
import { findTiposLavado } from "../../services/api";
import "../../styles/tiposLavado/BuscadorTipoLavado.css"

const BuscadorTiposLavado = ({ onResult }) => {
  const [search, setSearch] = useState("");
  const [searchField, setSearchField] = useState("titulo");

  const handleSearch = async () => {
    let query = {};
    query[searchField] = search;
    const response = await findTiposLavado(query);

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
        <option value="titulo">Titulo</option>
        <option value="descripcion">Descripcion</option>
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

export default BuscadorTiposLavado;
