import React, { useState } from "react";
import { getClientsByName, getClientsByVehiculo } from "../../services/api";
import "../../styles/clientes/BuscadorClientes.css"

const BuscadorClientes = ({ onResult }) => {
  const [search, setSearch] = useState("");
  const [searchField, setSearchField] = useState("nombre");

  const handleSearch = async () => {
    let query = {};
    if (
      searchField == "nombre" ||
      searchField == "dni" ||
      searchField == "celular"
    ) {
      if (searchField == "dni" || searchField == "celular") {
        query[searchField] = Number(search);
      } else {
        query[searchField] = search;
      }
      const response = await getClientsByName(query);
      onResult(response.data);
    }

    if (
      searchField == "marca" ||
      searchField == "modelo" ||
      searchField == "matricula"
    ) {
      query[searchField] = search;
      const response = await getClientsByVehiculo(query);
      onResult(response.data);
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
        <option value="nombre">Nombre</option>
        <option value="dni">DNI</option>
        <option value="celular">Celular</option>
        <option value="marca">Marca</option>
        <option value="modelo">Modelo</option>
        <option value="matricula">Matricula</option>
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

export default BuscadorClientes;
