import React, {useState, useEffect} from 'react'
import Select from "react-select"
import { getEmpleadoList, inicioLavado } from '../../services/api'
import { toast } from 'react-toastify'

const IniciarLavadoForm = ({lavadoId, onClose, loadLavados}) => {
  const [lavadores, setLavadores] = useState([]);
  const [selectedLavadores, setSelectedLavadores] = useState([]);

  useEffect(() => {
    const fetchLavadores = async () =>{
      try {
        const response = await getEmpleadoList()
        setLavadores(response.data)
      } catch (error) {
        toast.error("Error al cargar lavadores")
      }
    }

    fetchLavadores()
  }, []);

  const handleSubmit = async (e)=>{
    e.preventDefault()
    try {
      if (selectedLavadores.length === 0) {
        toast.error("Por favor seleccione al menos un elemento");
        return;
      }

      const lavadoresIds = selectedLavadores.map(l => l.value);
      console.log("Lavadores seleccionados:", lavadoresIds);

      await inicioLavado(lavadoId, lavadoresIds);
      toast.success("Lavado iniciado con éxito");
      onClose();
      loadLavados()
    } catch (error) {
      console.error("Error al iniciar lavado:", error); 
      toast.error("Error al iniciar lavado");
    }
  }

  return (
    <div className='iniciar-lavado-form'>
      <h2>Seleccionar Lavadores</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Lavadores:</label>
          <Select
            isMulti
            value={selectedLavadores}
            onChange={setSelectedLavadores}
            options={lavadores.map(lavador => ({
              value: lavador._id,
              label: lavador.nombre,
            }))}
          />
        </div>
        <button type="submit">Iniciar Lavado</button>
      </form>
    </div>
  )
}

export default IniciarLavadoForm