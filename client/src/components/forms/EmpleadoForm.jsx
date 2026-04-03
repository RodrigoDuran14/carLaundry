import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createEmpleado, updateEmpleado } from '../../features/empleados/empleadosSlice';
import Button from '../ui/Button';
import toast from 'react-hot-toast';

const EmpleadoForm = ({ empleado, onSuccess, onCancel }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: empleado?.nombre || '',
    dni: empleado?.dni || '',
    mail: empleado?.mail || '',
    celular: empleado?.celular || '',
    direccion: empleado?.direccion || '',
    cargo: empleado?.cargo || '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (empleado) {
        // Asegurarse de que el ID existe
        const empleadoId = empleado.id || empleado._id;
        console.log('Actualizando empleado con ID:', empleadoId); // Debug
        console.log('Datos a enviar:', formData); // Debug
        
        if (!empleadoId) {
          throw new Error('ID de empleado no encontrado');
        }
        
        await dispatch(updateEmpleado({ 
          id: empleadoId, 
          data: formData 
        })).unwrap();
        
        toast.success('Empleado actualizado exitosamente');
      } else {
        await dispatch(createEmpleado(formData)).unwrap();
        toast.success('Empleado creado exitosamente');
      }
      onSuccess();
    } catch (error) {
      console.error('Error al guardar empleado:', error);
      toast.error(error.message || 'Error al guardar el empleado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nombre completo *
        </label>
        <input
          type="text"
          value={formData.nombre}
          onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          DNI *
        </label>
        <input
          type="text"
          value={formData.dni}
          onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          type="email"
          value={formData.mail}
          onChange={(e) => setFormData({ ...formData, mail: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Teléfono *
        </label>
        <input
          type="tel"
          value={formData.celular}
          onChange={(e) => setFormData({ ...formData, celular: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Cargo
        </label>
        <input
          type="text"
          value={formData.cargo}
          onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
          placeholder="Ej: Lavador, Supervisor, etc."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Dirección
        </label>
        <input
          type="text"
          value={formData.direccion}
          onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Guardando...' : empleado ? 'Actualizar' : 'Crear'}
        </Button>
      </div>
    </form>
  );
};

export default EmpleadoForm;