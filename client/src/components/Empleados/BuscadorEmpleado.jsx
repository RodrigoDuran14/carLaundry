import React, { useState } from "react";
import { findEmpleado } from "../../services/api";
import { toast } from "react-toastify";
import "../../styles/empleados/buscadorEmpleado.css";

const BuscadorEmpleado = ({ onResult }) => {
  const [search, setSearch] = useState("");
  const [searchField, setSearchField] = useState("nombre");

  const handleSearch = async () => {
    try {
      let query = {};

      if (searchField == "dni" || searchField == "celular") {
        query[searchField] = Number(search);
      } else {
        query[searchField] = search;
      }
      const response = await findEmpleado(query);
      if(response.data.length === 0) {
        setSearch("")
        toast.info("No se encontraron Empleados con esos parametros");
      }else{
        onResult(response.data);
      }
    } catch (error) {
      toast.error("Error al buscar Empleado");
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
        <option value="mail">Mail</option>
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

export default BuscadorEmpleado;
