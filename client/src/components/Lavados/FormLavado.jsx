import React, { useState, useEffect } from "react";
import {
  postLavados,
  getTiposLavadoList,
  getClientList,
} from "../../services/api";
import { toast } from "react-toastify";
import Select from "react-select"

const FormLavado = ({ onCreate }) => {
  const [tiposDeLavado, setTiposDeLavado] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [selectedTiposDeLavado, setSelectedTiposDeLavado] = useState([]);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [filteredVehiculos, setFilteredVehiculos] = useState([]);
  const [selectedVehiculo, setSelectedVehiculo] = useState(null);

  useEffect(() => {
    const fetchLavados = async () => {
      try {
        const tiposDeLavadoData = await getTiposLavadoList();
        setTiposDeLavado(tiposDeLavadoData.data);

        const clientesData = await getClientList();
        setClientes(clientesData.data);
        setVehiculos(clientesData.data.flatMap(c=>c.vehiculo));
      } catch (error) {
        toast.error("Error al cargar Lavados");
      }
    };

    fetchLavados();
  }, []);

  useEffect(() => {
    if(selectedCliente){
      const cliente = clientes.find(c=>c._id === selectedCliente.value)
      setFilteredVehiculos(cliente ? cliente.vehiculo : [])
    }else{
      setFilteredVehiculos([])
    }
  }, [selectedCliente, clientes]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !selectedTiposDeLavado.length ||
      !selectedCliente ||
      !selectedVehiculo
    ) {
      toast.error("Todos los campos son obligatorios");
      return;
    }

    const newLavado = {
      tipoLavado: selectedTiposDeLavado.map(option=>option.value),
      clienteId: selectedCliente.value,
      vehiculoId: selectedVehiculo.value,
    };

    try {
      await postLavados(newLavado);
      onCreate();
      toast.success("Nuevo lavado creado con exito");
    } catch (error) {
      toast.error("Error al crear Lavado");
    }
  };

  return (
    <div className="form-container">
      <h2>Nuevo Lavado</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Tipos de Lavado:</label>
          <Select
            isMulti
            value={selectedTiposDeLavado}
            onChange={setSelectedTiposDeLavado}
            options={tiposDeLavado.map(tipo => ({
              value: tipo._id,
              label: tipo.titulo,
            }))}
          />
        </div>
        <div>
          <label>Cliente</label>
          <Select
            value={selectedCliente}
            onChange={setSelectedCliente}
            options={clientes.map(cliente => ({
              value: cliente._id,
              label: cliente.nombre,
            }))}
            placeholder="Seleccione un cliente"
          />
        </div>
        <div>
          <label>Vehiculo</label>
          <Select
            value={selectedVehiculo}
            onChange={setSelectedVehiculo}
            options={filteredVehiculos.map(v => ({
              value: v._id,
              label: `${v.marca} ${v.modelo} - ${v.matricula}`,
            }))}
            placeholder="Seleccione un vehículo"
          />
        </div>
        <button type="submit">Crear Lavado</button>
      </form>
    </div>
  );
};

export default FormLavado;
