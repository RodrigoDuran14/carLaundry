import React, { useState, useEffect } from "react";
import { findVehiculo } from "../../services/api";
import { toast } from "react-toastify";
import "../../styles/vehiculos/BuscadorVehiculo.css"

const BuscadorVehiculos = ({ onSelect }) => {
  const [search, setSearch] = useState("");
  const [vehiculos, setVehiculos] = useState([]);

  useEffect(() => {
    if (search) {
      try {
        const fetchVehiculos = async () => {
          const response = await findVehiculo({ marca: search });
          if(response.data.length === 0) {
            toast.info("No se encontraron vehiculos con esos parametros");
          }else{
            setVehiculos(response.data);
          }
        };
        fetchVehiculos();
      } catch (error) {
        toast.error("Error al buscar Vehiculo")
      }
    } else {
      setVehiculos([]);
    }
  }, [search]);
  return (
    <div>
      <input
        type="text"
        placeholder="Buscar vehiculo por marca"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <ul>
        {vehiculos.map((vehiculo) => (
          <li key={vehiculo.id} onClick={() => onSelect(vehiculo)}>
            {vehiculo.marca} - {vehiculo.modelo} - {vehiculo.matricula}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BuscadorVehiculos;
