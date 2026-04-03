import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createLavado } from '../../features/lavados/lavadosSlice';
import { fetchClientes } from '../../features/clientes/clientesSlice';
import { fetchEmpleados } from '../../features/empleados/empleadosSlice';
import { fetchTiposLavado } from '../../features/tiposLavado/tiposLavadoSlice';
import Button from '../ui/Button';
import toast from 'react-hot-toast';

const LavadoForm = ({ onSuccess, onCancel }) => {
  const dispatch = useDispatch();
  const { items: clientes } = useSelector((state) => state.clientes);
  const { items: empleados } = useSelector((state) => state.empleados);
  const { items: tiposLavado } = useSelector((state) => state.tiposLavado);
  
  const [loading, setLoading] = useState(false);
  const [vehiculosDelCliente, setVehiculosDelCliente] = useState([]);
  const [iniciarAhora, setIniciarAhora] = useState(false);
  const [formData, setFormData] = useState({
    clienteId: '',
    vehiculoId: '',
    tipoLavado: [],
    lavador: [],
    observaciones: '',
  });

  useEffect(() => {
    dispatch(fetchClientes());
    dispatch(fetchEmpleados());
    dispatch(fetchTiposLavado());
  }, [dispatch]);

  // Cuando cambia el cliente, actualizar la lista de vehículos
  useEffect(() => {
    if (formData.clienteId) {
      const clienteSeleccionado = clientes?.find(c => c._id === formData.clienteId);
      setVehiculosDelCliente(clienteSeleccionado?.vehiculo || []);
      setFormData(prev => ({ ...prev, vehiculoId: '' }));
    } else {
      setVehiculosDelCliente([]);
    }
  }, [formData.clienteId, clientes]);

  // Si se marca "iniciar ahora", asegurarse de que haya lavadores seleccionados
  useEffect(() => {
    if (iniciarAhora && formData.lavador.length === 0) {
      toast.error('Para iniciar el lavado ahora, debe seleccionar al menos un empleado lavador');
      setIniciarAhora(false);
    }
  }, [iniciarAhora, formData.lavador]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.lavador.length === 0) {
      toast.error('Debe seleccionar al menos un empleado lavador');
      return;
    }
    
    if (formData.tipoLavado.length === 0) {
      toast.error('Debe seleccionar al menos un tipo de lavado');
      return;
    }
    
    setLoading(true);
    
    try {
      const dataToSend = {
        clienteId: formData.clienteId,
        vehiculoId: formData.vehiculoId,
        tipoLavado: formData.tipoLavado,
        lavador: formData.lavador,
        observaciones: formData.observaciones,
        iniciarAhora: iniciarAhora, // Indicar si se debe iniciar inmediatamente
      };
      
      const result = await dispatch(createLavado(dataToSend)).unwrap();
      
      if (iniciarAhora) {
        toast.success('Lavado creado e iniciado exitosamente');
      } else {
        toast.success('Lavado registrado exitosamente');
      }
      
      onSuccess();
    } catch (error) {
      toast.error(error.message || 'Error al registrar lavado');
    } finally {
      setLoading(false);
    }
  };

  const handleTipoLavadoChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions);
    const selectedIds = selectedOptions.map(option => option.value);
    setFormData({ ...formData, tipoLavado: selectedIds });
  };

  const handleEmpleadoChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions);
    const selectedIds = selectedOptions.map(option => option.value);
    setFormData({ ...formData, lavador: selectedIds });
  };

  const clienteSeleccionado = clientes?.find(c => c._id === formData.clienteId);
  const total = formData.tipoLavado.reduce((sum, id) => {
    const tipo = tiposLavado?.find(t => t._id === id);
    return sum + (tipo?.precio || 0);
  }, 0);

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
      {/* Selección de Cliente */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Cliente *</label>
        <select
          value={formData.clienteId}
          onChange={(e) => setFormData({ ...formData, clienteId: e.target.value, vehiculoId: '' })}
          className="input"
          required
        >
          <option value="">Seleccionar cliente</option>
          {clientes?.filter(c => c.activo).map((cliente) => (
            <option key={cliente._id} value={cliente._id}>
              {cliente.nombre} - {cliente.dni} - {cliente.celular}
            </option>
          ))}
        </select>
      </div>

      {/* Información del Cliente */}
      {clienteSeleccionado && (
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
          <p className="text-sm font-medium text-blue-800 mb-1">Información del Cliente</p>
          <p className="text-sm text-blue-700">📞 Teléfono: {clienteSeleccionado.celular || 'No registrado'}</p>
          <p className="text-sm text-blue-700">📧 Email: {clienteSeleccionado.mail || 'No registrado'}</p>
        </div>
      )}

      {/* Selección de Vehículo */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Vehículo *</label>
        <select
          value={formData.vehiculoId}
          onChange={(e) => setFormData({ ...formData, vehiculoId: e.target.value })}
          className="input"
          required
          disabled={!formData.clienteId || vehiculosDelCliente.length === 0}
        >
          <option value="">
            {!formData.clienteId 
              ? 'Primero seleccione un cliente' 
              : vehiculosDelCliente.length === 0 
                ? 'Este cliente no tiene vehículos registrados' 
                : 'Seleccionar vehículo'}
          </option>
          {vehiculosDelCliente.map((vehiculo) => (
            <option key={vehiculo._id} value={vehiculo._id}>
              {vehiculo.marca} {vehiculo.modelo} - {vehiculo.matricula}
            </option>
          ))}
        </select>
      </div>

      {/* Tipos de Lavado */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tipos de Lavado * <span className="text-xs text-gray-500">(Múltiple)</span>
        </label>
        <select
          multiple
          value={formData.tipoLavado}
          onChange={handleTipoLavadoChange}
          className="input min-h-[120px]"
          required
        >
          {tiposLavado?.filter(t => t.activo).map((tipo) => (
            <option key={tipo._id} value={tipo._id}>
              {tipo.titulo || tipo.nombre} - ${tipo.precio?.toLocaleString()} - {tipo.duracion} min
            </option>
          ))}
        </select>
        <p className="text-xs text-gray-500 mt-1">Ctrl+Click para seleccionar múltiples</p>
      </div>

      {/* Empleados Lavadores */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Empleados Lavadores * <span className="text-xs text-gray-500">(Múltiple)</span>
        </label>
        <select
          multiple
          value={formData.lavador}
          onChange={handleEmpleadoChange}
          className="input min-h-[100px]"
          required
        >
          {empleados?.filter(e => e.activo).map((empleado) => (
            <option key={empleado._id} value={empleado._id}>
              {empleado.nombre} - {empleado.cargo || 'Lavador'}
            </option>
          ))}
        </select>
        <p className="text-xs text-gray-500 mt-1">Ctrl+Click para seleccionar múltiples lavadores</p>
      </div>

      {/* Checkbox para iniciar ahora */}
      <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={iniciarAhora}
            onChange={(e) => setIniciarAhora(e.target.checked)}
            className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
            disabled={formData.lavador.length === 0}
          />
          <div>
            <span className="text-sm font-medium text-gray-700">Iniciar lavado ahora</span>
            <p className="text-xs text-gray-500">
              {formData.lavador.length === 0 
                ? '(Seleccione al menos un empleado para iniciar ahora)' 
                : 'El lavado comenzará inmediatamente con los empleados seleccionados'}
            </p>
          </div>
        </label>
      </div>

      {/* Observaciones */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
        <textarea
          value={formData.observaciones}
          onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
          className="input"
          rows="3"
          placeholder="Instrucciones especiales..."
        />
      </div>

      {/* Resumen */}
      {formData.tipoLavado.length > 0 && (
        <div className="bg-gray-50 p-3 rounded-lg border">
          <p className="text-sm font-medium mb-2">Resumen del pedido</p>
          <div className="space-y-1">
            {formData.tipoLavado.map(id => {
              const tipo = tiposLavado?.find(t => t._id === id);
              return (
                <div key={id} className="flex justify-between text-sm">
                  <span>{tipo?.titulo || tipo?.nombre}</span>
                  <span>${tipo?.precio?.toLocaleString()}</span>
                </div>
              );
            })}
            <div className="border-t pt-1 mt-1 flex justify-between font-bold">
              <span>Total</span>
              <span>${total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}

      {/* Información adicional si se inicia ahora */}
      {iniciarAhora && formData.lavador.length > 0 && (
        <div className="bg-green-50 p-3 rounded-lg border border-green-200">
          <p className="text-sm font-medium text-green-800 mb-1">⚠️ Información importante</p>
          <p className="text-sm text-green-700">
            Al iniciar el lavado ahora, se registrará la hora de inicio y el estado cambiará a "En progreso".
            Los empleados seleccionados quedarán asignados a este lavado.
          </p>
        </div>
      )}

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Guardando...' : iniciarAhora ? 'Crear e Iniciar Lavado' : 'Registrar Lavado'}
        </Button>
      </div>
    </form>
  );
};

export default LavadoForm;