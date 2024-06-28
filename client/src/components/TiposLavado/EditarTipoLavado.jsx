import React, {useState, useEffect} from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getTiposLavadoById, updateTiposLavado } from '../../services/api'
import { toast } from "react-toastify";
import "../../styles/tiposLavado/EditarTipoLavado.css"

const EditarTipoLavado = () => {
  const {id} = useParams()
  const navigate = useNavigate()
  const [tiposLavados, setTiposLavados] = useState(null);

  useEffect(() => {
    try {
      const fetchTipoLavado = async()=>{
        const response = await getTiposLavadoById(id)
        setTiposLavados(response.data)
      }
      fetchTipoLavado()
    } catch (error) {
      toast.error("Error al cargar los Tipos de Lavado")
    }
  }, [id]);

  const handleChange = (e)=>{
    setTiposLavados({
      ...tiposLavados,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e)=>{
    try {
      e.preventDefault()
      if (!tiposLavados.titulo || !tiposLavados.descripcion || !tiposLavados.precio ) {
        toast.error("Todos los campos son obligatorios");
        return;
      }
      await updateTiposLavado(id, tiposLavados)
      toast.success("Tipo de Lavado actualizado correctamente")
      navigate("/tipos-lavados")
    } catch (error) {
      toast.error("Error al actualizar tipos de lavado")
    }
  }

  if(!tiposLavados) return <div>Cargando...</div>

  return (
    <div className='container'>
      <h1>Editar Tipo de Lavado</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name='titulo' value={tiposLavados.titulo} onChange={handleChange} />
        <input type="text" name='descripcion' value={tiposLavados.descripcion} onChange={handleChange} />
        <input type="number" name='precio' value={tiposLavados.precio} onChange={handleChange} />
        <button type='submit'>Guardar</button>
      </form>
    </div>
  )
}

export default EditarTipoLavado