import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addVehiculoToCliente } from '../../features/clientes/clientesSlice';
import Button from '../ui/Button';
import toast from 'react-hot-toast';

const AddVehiculoForm = ({ cliente, onSuccess, onCancel }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    marca: '',
    modelo: '',
    matricula: '',
    color: '',
    tipo: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const clienteId = cliente.id || cliente._id;
      if (!clienteId) throw new Error('ID de cliente no encontrado');
      
      await dispatch(addVehiculoToCliente({
        clienteId,
        vehiculo: formData
      })).unwrap();
      
      toast.success('Vehículo agregado exitosamente');
      onSuccess();
    } catch (error) {
      toast.error(error.message || 'Error al agregar vehículo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
        <input
          type="text"
          value={cliente?.nombre || ''}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
          disabled
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Matrícula *</label>
        <input
          type="text"
          value={formData.matricula}
          onChange={(e) => setFormData({ ...formData, matricula: e.target.value.toUpperCase() })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
          placeholder="ABC123"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Marca *</label>
        <input
          type="text"
          value={formData.marca}
          onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
          placeholder="Toyota, Ford, etc."
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Modelo *</label>
        <input
          type="text"
          value={formData.modelo}
          onChange={(e) => setFormData({ ...formData, modelo: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
          placeholder="Corolla, Fiesta, etc."
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
        <input
          type="text"
          value={formData.color}
          onChange={(e) => setFormData({ ...formData, color: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
          placeholder="Rojo, Azul, etc."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Vehículo</label>
        <select
          value={formData.tipo}
          onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
        >
          <option value="">Seleccionar tipo</option>
          <option value="Auto">Auto</option>
          <option value="Camioneta">Camioneta</option>
          <option value="SUV">SUV</option>
          <option value="Moto">Moto</option>
          <option value="Camión">Camión</option>
        </select>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" disabled={loading}>{loading ? 'Agregando...' : 'Agregar Vehículo'}</Button>
      </div>
    </form>
  );
};

export default AddVehiculoForm;