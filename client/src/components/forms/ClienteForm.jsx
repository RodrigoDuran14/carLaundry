import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createCliente, updateCliente } from '../../features/clientes/clientesSlice';
import Button from '../ui/Button';
import toast from 'react-hot-toast';

const ClienteForm = ({ cliente, onSuccess, onCancel }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: cliente?.nombre || '',
    dni: cliente?.dni || '',
    mail: cliente?.mail || '',
    celular: cliente?.celular || '',
    direccion: cliente?.direccion || '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (cliente) {
        // Asegurarse de que el ID existe
        const clienteId = cliente.id || cliente._id;
        console.log('Actualizando cliente con ID:', clienteId); // Debug
        console.log('Datos a enviar:', formData); // Debug
        
        if (!clienteId) {
          throw new Error('ID de cliente no encontrado');
        }
        
        await dispatch(updateCliente({ 
          id: clienteId, 
          data: formData 
        })).unwrap();
        
        toast.success('Cliente actualizado exitosamente');
      } else {
        await dispatch(createCliente(formData)).unwrap();
        toast.success('Cliente creado exitosamente');
      }
      onSuccess();
    } catch (error) {
      console.error('Error al guardar cliente:', error);
      toast.error(error.message || 'Error al guardar el cliente');
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
          {loading ? 'Guardando...' : cliente ? 'Actualizar' : 'Crear'}
        </Button>
      </div>
    </form>
  );
};

export default ClienteForm;