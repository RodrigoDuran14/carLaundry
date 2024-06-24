import React, { useState } from "react";
import { findTiposLavado } from "../../services/api";
import { toast } from "react-toastify";
import "../../styles/tiposLavado/BuscadorTipoLavado.css";

const BuscadorTiposLavado = ({ onResult }) => {
  const [search, setSearch] = useState("");
  const [searchField, setSearchField] = useState("titulo");

  const handleSearch = async () => {
    try {
      let query = {};
      query[searchField] = search;
      const response = await findTiposLavado(query);
      if(response.data.length === 0) {
        setSearch("")
        toast.info("No se encontraron tipos de lavados con esos parametros");
      }else{
        onResult(response.data);
      }

    } catch (error) {
      toast.error("Error al buscar Tipos de lavado");
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
