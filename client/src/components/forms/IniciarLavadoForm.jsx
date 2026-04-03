import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEmpleados } from '../../features/empleados/empleadosSlice';
import Button from '../ui/Button';
import toast from 'react-hot-toast';

const IniciarLavadoForm = ({ lavado, onSuccess, onCancel }) => {
  const dispatch = useDispatch();
  const { items: empleados } = useSelector((state) => state.empleados);
  const [loading, setLoading] = useState(false);
  const [selectedEmpleados, setSelectedEmpleados] = useState([]);
  const [reemplazar, setReemplazar] = useState(false);

  useEffect(() => {
    dispatch(fetchEmpleados());
    // Cargar empleados actuales del lavado
    if (lavado?.lavador) {
      const lavadoresActuales = lavado.lavador.map(e => e._id);
      setSelectedEmpleados(lavadoresActuales);
    }
  }, [dispatch, lavado]);

  const handleEmpleadoChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions);
    const selectedIds = selectedOptions.map(option => option.value);
    setSelectedEmpleados(selectedIds);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (selectedEmpleados.length === 0) {
      toast.error('Debe seleccionar al menos un empleado lavador');
      return;
    }
    
    setLoading(true);
    
    try {
      // Llamar al endpoint de inicio con los lavadores
      const response = await fetch(`http://localhost:3000/api/lavado/${lavado._id}/inicio`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lavadores: selectedEmpleados,
          reemplazar: reemplazar
        }),
      });
      
      if (!response.ok) {
        throw new Error('Error al iniciar el lavado');
      }
      
      toast.success('Lavado iniciado exitosamente');
      onSuccess();
    } catch (error) {
      toast.error(error.message || 'Error al iniciar el lavado');
    } finally {
      setLoading(false);
    }
  };

  const lavadoresActuales = lavado?.lavador || [];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Mostrar lavadores actuales si existen */}
      {lavadoresActuales.length > 0 && (
        <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
          <p className="text-sm font-medium text-yellow-800 mb-2">
            Lavadores actualmente asignados:
          </p>
          <div className="flex flex-wrap gap-2">
            {lavadoresActuales.map((empleado) => (
              <span key={empleado._id} className="inline-flex items-center px-2 py-1 rounded text-xs bg-yellow-100 text-yellow-800">
                {empleado.nombre}
              </span>
            ))}
          </div>
          
          <div className="mt-3">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={reemplazar}
                onChange={(e) => setReemplazar(e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-gray-700">
                Reemplazar lavadores actuales (en lugar de agregar nuevos)
              </span>
            </label>
          </div>
        </div>
      )}

      {/* Selección de nuevos lavadores */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {lavadoresActuales.length > 0 
            ? (reemplazar ? 'Nuevos lavadores' : 'Lavadores adicionales')
            : 'Seleccionar lavadores'}
          * <span className="text-xs text-gray-500">(Múltiple)</span>
        </label>
        <select
          multiple
          value={selectedEmpleados}
          onChange={handleEmpleadoChange}
          className="input min-h-[120px]"
          required
        >
          {empleados?.filter(e => e.activo).map((empleado) => (
            <option key={empleado._id} value={empleado._id}>
              {empleado.nombre} - {empleado.cargo || 'Lavador'} - {empleado.celular}
            </option>
          ))}
        </select>
        <p className="text-xs text-gray-500 mt-1">
          Mantenga Ctrl (Cmd) para seleccionar múltiples empleados
        </p>
      </div>

      {/* Mostrar empleados seleccionados */}
      {selectedEmpleados.length > 0 && (
        <div className="bg-green-50 p-3 rounded-lg border border-green-200">
          <p className="text-sm font-medium text-green-800 mb-2">
            {reemplazar ? 'Nuevos lavadores seleccionados:' : 'Lavadores seleccionados:'}
          </p>
          <div className="flex flex-wrap gap-2">
            {selectedEmpleados.map(id => {
              const empleado = empleados?.find(e => e._id === id);
              return empleado ? (
                <span key={id} className="inline-flex items-center px-2 py-1 rounded text-xs bg-green-100 text-green-800">
                  {empleado.nombre}
                </span>
              ) : null;
            })}
          </div>
        </div>
      )}

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Iniciando...' : 'Iniciar Lavado'}
        </Button>
      </div>
    </form>
  );
};

export default IniciarLavadoForm;