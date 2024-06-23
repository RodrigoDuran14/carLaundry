import React, { useState } from "react";
import { findVehiculo } from "../../services/api";
import { toast } from "react-toastify";
import "../../styles/vehiculos/BuscadorVehiculoCompleto.css"

const BuscadorVehiculoCompleto = ({ onResult }) => {
  const [search, setSearch] = useState("");
  const [searchField, setSearchField] = useState("marca");

  const handleSearch = async () => {
    try {
      let query = {};
      query[searchField] = search;
      const response = await findVehiculo(query);
      
      if(response.data.length === 0) {
        toast.info("No se encontraron vehiculos con esos parametros");
      }else{
        onResult(response.data);
      }
    } catch (error) {
      toast.error("Error al buscar Vehiculo")
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
