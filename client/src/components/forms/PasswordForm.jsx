import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createPassword } from '../../features/empleados/empleadosSlice';
import Button from '../ui/Button';
import toast from 'react-hot-toast';

const PasswordForm = ({ empleado, onSuccess, onCancel }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }
    
    if (password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    
    setLoading(true);
    
    try {
      const empleadoId = empleado.id || empleado._id;
      if (!empleadoId) throw new Error('ID de empleado no encontrado');
      
      await dispatch(createPassword({ id: empleadoId, password })).unwrap();
      toast.success('Contraseña creada exitosamente');
      onSuccess();
    } catch (error) {
      toast.error(error.message || 'Error al crear contraseña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Empleado</label>
        <input
          type="text"
          value={empleado?.nombre || ''}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
          disabled
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña *</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
          placeholder="Ingrese la contraseña"
          required
          minLength={6}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Contraseña *</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
          placeholder="Confirme la contraseña"
          required
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" disabled={loading}>{loading ? 'Guardando...' : 'Crear Contraseña'}</Button>
      </div>
    </form>
  );
};

export default PasswordForm;