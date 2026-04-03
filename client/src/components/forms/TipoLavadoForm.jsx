import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createTipoLavado, updateTipoLavado } from '../../features/tiposLavado/tiposLavadoSlice';
import Button from '../ui/Button';
import toast from 'react-hot-toast';

const TipoLavadoForm = ({ tipo, onSuccess, onCancel }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    titulo: tipo?.titulo || '',
    descripcion: tipo?.descripcion || '',
    precio: tipo?.precio || '',
    duracion: tipo?.duracion || '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const dataToSend = {
        titulo: formData.titulo,
        descripcion: formData.descripcion,
        precio: parseFloat(formData.precio),
        duracion: parseInt(formData.duracion),
      };
      
      if (tipo) {
        const tipoId = tipo.id || tipo._id;
        if (!tipoId) throw new Error('ID de tipo de lavado no encontrado');
        await dispatch(updateTipoLavado({ id: tipoId, data: dataToSend })).unwrap();
        toast.success('Tipo de lavado actualizado exitosamente');
      } else {
        await dispatch(createTipoLavado(dataToSend)).unwrap();
        toast.success('Tipo de lavado creado exitosamente');
      }
      onSuccess();
    } catch (error) {
      console.error('Error al guardar tipo de lavado:', error);
      toast.error(error.message || 'Error al guardar el tipo de lavado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nombre del servicio *
        </label>
        <input
          type="text"
          value={formData.titulo}
          onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
          placeholder="Ej: Lavado Completo, Encerado, etc."
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Descripción
        </label>
        <textarea
          value={formData.descripcion}
          onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
          rows="3"
          placeholder="Descripción detallada del servicio..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Precio *
        </label>
        <input
          type="number"
          value={formData.precio}
          onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
          placeholder="0"
          min="0"
          step="100"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Duración (minutos) *
        </label>
        <input
          type="number"
          value={formData.duracion}
          onChange={(e) => setFormData({ ...formData, duracion: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
          placeholder="30"
          min="1"
          required
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Guardando...' : tipo ? 'Actualizar' : 'Crear'}
        </Button>
      </div>
    </form>
  );
};

export default TipoLavadoForm;