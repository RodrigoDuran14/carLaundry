import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getLavadoById,
  getTiposLavadoList,
  getEmpleadoList,
  updateLavado,
} from "../../services/api";
import { toast } from "react-toastify";
import Select from "react-select"
import "../../styles/lavados/EditarLavado.css"

const EditarLavados = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lavado, setLavado] = useState(null);
  const [tiposDeLavado, setTiposDeLavado] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [selectedTiposDeLavado, setSelectedTiposDeLavado] = useState([]);
  const [selectedLavadores, setSelectedLavadores] = useState([]);
  const [prevSelectedTiposDeLavado, setPrevSelectedTiposDeLavado] = useState([]);
  const [prevSelectedLavadores, setPrevSelectedLavadores] = useState([]);

  useEffect(() => {
    try {
      const fetchLavado = async () => {
        const lavadoData = await getLavadoById(id);
        setLavado(lavadoData.data);
        setSelectedTiposDeLavado(lavadoData.data.tipoLavado.map((t) => t._id));
        setSelectedLavadores(lavadoData.data.lavador.map((l) => l._id));

        const tiposDeLavadosData = await getTiposLavadoList();
        setTiposDeLavado(tiposDeLavadosData.data);

        const empleadosData = await getEmpleadoList();
        setEmpleados(empleadosData.data);
      };
      fetchLavado();
    } catch (error) {
      toast.error("Error al cargar Lavado");
    }
  }, [id]);

  const handleTipoLavadoChange = (selectedOptions) => {
    const selectedValues = selectedOptions ? selectedOptions.map(option => option.value) : [];
    const addedOptions = selectedValues.filter(value => !prevSelectedTiposDeLavado.includes(value));
    const removedOptions = prevSelectedTiposDeLavado.filter(value => !selectedValues.includes(value));
    
    if (addedOptions.length > 0) {
      const addedTitles = tiposDeLavado
        .filter(tipo => addedOptions.includes(tipo._id))
        .map(tipo => tipo.titulo)
        .join(', ');
      toast.info(`Tipos de Lavado seleccionados: ${addedTitles}`);
    }

    if (removedOptions.length > 0) {
      const removedTitles = tiposDeLavado
        .filter(tipo => removedOptions.includes(tipo._id))
        .map(tipo => tipo.titulo)
        .join(', ');
      toast.error(`Tipos de Lavado eliminados: ${removedTitles}`);
    }

    setSelectedTiposDeLavado(selectedValues);
    setPrevSelectedTiposDeLavado(selectedValues);
  };

  const handleLavadorChange = (selectedOptions) => {
    const selectedValues = selectedOptions ? selectedOptions.map(option => option.value) : [];
    const addedOptions = selectedValues.filter(value => !prevSelectedLavadores.includes(value));
    const removedOptions = prevSelectedLavadores.filter(value => !selectedValues.includes(value));

    if (addedOptions.length > 0) {
      const addedNames = empleados
        .filter(e => addedOptions.includes(e._id))
        .map(e => e.nombre)
        .join(', ');
      toast.info(`Lavadores seleccionados: ${addedNames}`);
    }

    if (removedOptions.length > 0) {
      const removedNames = empleados
        .filter(e => removedOptions.includes(e._id))
        .map(e => e.nombre)
        .join(', ');
      toast.error(`Lavadores eliminados: ${removedNames}`);
    }

    setSelectedLavadores(selectedValues);
    setPrevSelectedLavadores(selectedValues);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedLavado = {
      ...lavado,
      tipoLavado: selectedTiposDeLavado,
      lavador: selectedLavadores,
    };

    try {
      if(selectedLavadores.length===0 || selectedTiposDeLavado.length===0){
        toast.error("Por favor seleccione al menos un Tipo de lavado y un Lavador")
        return
      }
        await updateLavado(id, updatedLavado);
        toast.success("Lavado actualizado correctamente");
        navigate("/lavados");
    } catch (error) {
      toast.error("Error al actualizar Lavado");
    }
  };

  const tiposDeLavadoOptions = tiposDeLavado.map(tipo => ({
    value: tipo._id,
    label: `${tipo.titulo} - ${tipo.precio}`
  }));

  const lavadoresOptions = empleados.map(e => ({
    value: e._id,
    label: e.nombre
  }));

  if (!lavado) return <div>Cargando...</div>;

  return (
    <div className="container">
      <h1>Editar Lavado</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Tipos de Lavado:</label>
          <Select
            isMulti
            value={tiposDeLavadoOptions.filter(option => selectedTiposDeLavado.includes(option.value))}
            options={tiposDeLavadoOptions}
            onChange={handleTipoLavadoChange}
          />
        </div>
        <div>
          <label>Lavadores:</label>
          <Select
            isMulti
            value={lavadoresOptions.filter(option => selectedLavadores.includes(option.value))}
            options={lavadoresOptions}
            onChange={handleLavadorChange}
          />
        </div>
        <button type="submit">Actualizar</button>
      </form>
    </div>
  );
};

export default EditarLavados;
