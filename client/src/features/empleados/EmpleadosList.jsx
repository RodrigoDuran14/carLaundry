import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEmpleados, toggleActiveEmpleado, updateAdminEmpleado, findEmpleados, setSearchType, clearFilters } from '../empleados/empleadosSlice';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import EmpleadoForm from '../../components/forms/EmpleadoForm';
import PasswordForm from '../../components/forms/PasswordForm';
import { FaEdit, FaCheckCircle, FaBan, FaSearch, FaUserPlus, FaUserShield, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';

const EmpleadosList = () => {
  const dispatch = useDispatch();
  const { items, loading, searchType } = useSelector((state) => state.empleados);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [selectedEmpleado, setSelectedEmpleado] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    dispatch(fetchEmpleados());
  }, [dispatch]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchTerm) {
        dispatch(findEmpleados({ [searchType]: searchTerm }));
      } else {
        dispatch(fetchEmpleados());
      }
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm, searchType, dispatch]);

  const handleOpenModal = (empleado = null) => {
    setSelectedEmpleado(empleado);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEmpleado(null);
  };

  const handleOpenPasswordModal = (empleado) => {
    setSelectedEmpleado(empleado);
    setIsPasswordModalOpen(true);
  };

  const handleClosePasswordModal = () => {
    setIsPasswordModalOpen(false);
    setSelectedEmpleado(null);
  };

  const handleEdit = (empleado) => {
    const empleadoId = empleado._id;
    if (!empleadoId) {
      toast.error('Error: Empleado sin ID válido');
      return;
    }
    handleOpenModal({ ...empleado, _id: empleadoId });
  };

  const handleToggleActive = async (empleado) => {
    const empleadoId = empleado._id;
    if (!empleadoId) return;
    
    setActionLoading(`active-${empleadoId}`);
    try {
      await dispatch(toggleActiveEmpleado(empleadoId)).unwrap();
      dispatch(fetchEmpleados());
    } catch (error) {
      toast.error('Error al cambiar estado');
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleAdmin = async (empleado) => {
    const empleadoId = empleado._id;
    if (!empleadoId) return;
    
    if (!empleado.admin) {
      // Si va a ser admin, pedir contraseña
      handleOpenPasswordModal(empleado);
      return;
    }
    
    // Si ya es admin, desactivar admin directamente
    setActionLoading(`admin-${empleadoId}`);
    try {
      await dispatch(updateAdminEmpleado(empleadoId)).unwrap();
      dispatch(fetchEmpleados());
    } catch (error) {
      toast.error('Error al cambiar estado de admin');
    } finally {
      setActionLoading(null);
    }
  };

  const handleSearchTypeChange = (e) => {
    dispatch(setSearchType(e.target.value));
    setSearchTerm('');
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
    setSearchTerm('');
  };

  const searchPlaceholders = {
    nombre: 'Buscar por nombre...',
    dni: 'Buscar por DNI...',
    mail: 'Buscar por email...',
    celular: 'Buscar por teléfono...',
  };

  if (loading && items.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-xl font-semibold text-gray-800">Lista de Empleados</h2>
        <Button onClick={() => handleOpenModal()} className="flex items-center gap-2">
          <FaUserPlus />
          Nuevo Empleado
        </Button>
      </div>

      {/* Barra de búsqueda */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={searchPlaceholders[searchType]}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>
          <select
            value={searchType}
            onChange={handleSearchTypeChange}
            className="input w-full sm:w-auto"
          >
            <option value="nombre">Buscar por nombre</option>
            <option value="dni">Buscar por DNI</option>
            <option value="mail">Buscar por email</option>
            <option value="celular">Buscar por teléfono</option>
          </select>
          {searchTerm && (
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors flex items-center gap-2"
            >
              <FaTimes />
              Limpiar búsqueda
            </button>
          )}
        </div>
      </div>

      {/* Tabla de empleados */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Nombre</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">DNI</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Email</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Teléfono</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Cargo</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Admin</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Estado</th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items?.map((empleado) => {
              const empleadoId = empleado._id;
              return (
                <tr key={empleadoId} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-800">{empleado.nombre}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{empleado.dni}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{empleado.mail || '-'}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{empleado.celular}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{empleado.cargo || '-'}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      empleado.admin ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {empleado.admin ? 'Administrador' : 'Empleado'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      empleado.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {empleado.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleEdit(empleado)}
                        className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                        title="Editar"
                        type="button"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleToggleAdmin(empleado)}
                        disabled={actionLoading === `admin-${empleadoId}`}
                        className={`p-1 transition-colors disabled:opacity-50 ${
                          empleado.admin ? 'text-orange-600 hover:text-orange-800' : 'text-purple-600 hover:text-purple-800'
                        }`}
                        title={empleado.admin ? 'Quitar admin' : 'Hacer admin'}
                        type="button"
                      >
                        {actionLoading === `admin-${empleadoId}` ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                        ) : (
                          <FaUserShield />
                        )}
                      </button>
                      <button
                        onClick={() => handleToggleActive(empleado)}
                        disabled={actionLoading === `active-${empleadoId}`}
                        className={`p-1 transition-colors disabled:opacity-50 ${
                          empleado.activo ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'
                        }`}
                        title={empleado.activo ? 'Desactivar' : 'Activar'}
                        type="button"
                      >
                        {actionLoading === `active-${empleadoId}` ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                        ) : empleado.activo ? (
                          <FaBan />
                        ) : (
                          <FaCheckCircle />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        
        {items?.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No hay empleados registrados
          </div>
        )}
      </div>

      {/* Modal Empleado */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={selectedEmpleado ? 'Editar Empleado' : 'Nuevo Empleado'}>
        <EmpleadoForm
          empleado={selectedEmpleado}
          onSuccess={() => {
            handleCloseModal();
            dispatch(fetchEmpleados());
          }}
          onCancel={handleCloseModal}
        />
      </Modal>

      {/* Modal Contraseña */}
      <Modal isOpen={isPasswordModalOpen} onClose={handleClosePasswordModal} title="Crear Contraseña de Administrador">
        <PasswordForm
          empleado={selectedEmpleado}
          onSuccess={async () => {
            const empleadoId = selectedEmpleado._id;
            if (empleadoId) {
              await dispatch(updateAdminEmpleado(empleadoId)).unwrap();
              dispatch(fetchEmpleados());
            }
            handleClosePasswordModal();
          }}
          onCancel={handleClosePasswordModal}
        />
      </Modal>
    </div>
  );
};

export default EmpleadosList;