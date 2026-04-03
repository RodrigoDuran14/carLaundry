import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createVehiculo, updateVehiculo } from '../../features/vehiculos/vehiculosSlice';
import { fetchClientes } from '../../features/clientes/clientesSlice';
import Button from '../ui/Button';

const VehiculoForm = ({ vehiculo, onSuccess, onCancel }) => {
  const dispatch = useDispatch();
  const { items: clientes } = useSelector((state) => state.clientes);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    matricula: vehiculo?.matricula || '',
    marca: vehiculo?.marca || '',
    modelo: vehiculo?.modelo || '',
    color: vehiculo?.color || '',
    tipo: vehiculo?.tipo || '',
    clienteId: vehiculo?.clienteId || '',
  });

  useEffect(() => {
    dispatch(fetchClientes());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    if (vehiculo) {
      await dispatch(updateVehiculo({ id: vehiculo.id, data: formData }));
    } else {
      await dispatch(createVehiculo(formData));
    }
    
    setLoading(false);
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Matrícula *
        </label>
        <input
          type="text"
          value={formData.matricula}
          onChange={(e) => setFormData({ ...formData, matricula: e.target.value.toUpperCase() })}
          className="input uppercase"
          placeholder="ABC123"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Marca *
        </label>
        <input
          type="text"
          value={formData.marca}
          onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
          className="input"
          placeholder="Ej: Toyota, Ford, etc."
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Modelo *
        </label>
        <input
          type="text"
          value={formData.modelo}
          onChange={(e) => setFormData({ ...formData, modelo: e.target.value })}
          className="input"
          placeholder="Ej: Corolla, Fiesta, etc."
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Color
        </label>
        <input
          type="text"
          value={formData.color}
          onChange={(e) => setFormData({ ...formData, color: e.target.value })}
          className="input"
          placeholder="Ej: Rojo, Azul, etc."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tipo de Vehículo
        </label>
        <select
          value={formData.tipo}
          onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
          className="input"
        >
          <option key="empty" value="">Seleccionar tipo</option>
          <option key="auto" value="Auto">Auto</option>
          <option key="camioneta" value="Camioneta">Camioneta</option>
          <option key="suv" value="SUV">SUV</option>
          <option key="moto" value="Moto">Moto</option>
          <option key="camion" value="Camión">Camión</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Propietario
        </label>
        <select
          value={formData.clienteId}
          onChange={(e) => setFormData({ ...formData, clienteId: e.target.value })}
          className="input"
        >
          <option key="empty-cliente" value="">Seleccionar cliente</option>
          {clientes?.filter(c => c.activo).map((cliente) => (
            <option key={cliente.id} value={cliente.id}>
              {cliente.nombre} - {cliente.dni}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Guardando...' : vehiculo ? 'Actualizar' : 'Crear'}
        </Button>
      </div>
    </form>
  );
};

export default VehiculoForm;