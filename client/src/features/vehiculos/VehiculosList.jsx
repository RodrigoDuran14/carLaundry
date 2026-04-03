import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVehiculos, toggleActiveVehiculo, findVehiculos, setSearchType, clearFilters } from './vehiculosSlice';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import VehiculoForm from '../../components/forms/VehiculoForm';
import { FaEdit, FaCheckCircle, FaBan, FaSearch, FaPlus, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';

const VehiculosList = () => {
  const dispatch = useDispatch();
  const { items, loading, searchType } = useSelector((state) => state.vehiculos);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVehiculo, setSelectedVehiculo] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    dispatch(fetchVehiculos());
  }, [dispatch]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchTerm) {
        dispatch(findVehiculos({ [searchType]: searchTerm }));
      } else {
        dispatch(fetchVehiculos());
      }
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm, searchType, dispatch]);

  const handleOpenModal = (vehiculo = null) => {
    setSelectedVehiculo(vehiculo);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedVehiculo(null);
  };

  const handleEdit = (vehiculo) => {
    const vehiculoId = vehiculo._id;
    if (!vehiculoId) {
      toast.error('Error: Vehículo sin ID válido');
      return;
    }
    handleOpenModal({ ...vehiculo, _id: vehiculoId });
  };

  const handleToggleActive = async (vehiculo) => {
    const vehiculoId = vehiculo._id;
    if (!vehiculoId) return;
    
    setActionLoading(vehiculoId);
    try {
      await dispatch(toggleActiveVehiculo(vehiculoId)).unwrap();
      dispatch(fetchVehiculos());
    } catch (error) {
      toast.error('Error al cambiar estado');
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
    matricula: 'Buscar por matrícula...',
    marca: 'Buscar por marca...',
    modelo: 'Buscar por modelo...',
    color: 'Buscar por color...',
    tipo: 'Buscar por tipo...',
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
        <h2 className="text-xl font-semibold text-gray-800">Lista de Vehículos</h2>
        <Button onClick={() => handleOpenModal()} className="flex items-center gap-2">
          <FaPlus />
          Nuevo Vehículo
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
            <option value="matricula">Buscar por matrícula</option>
            <option value="marca">Buscar por marca</option>
            <option value="modelo">Buscar por modelo</option>
            <option value="color">Buscar por color</option>
            <option value="tipo">Buscar por tipo</option>
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

      {/* Tabla de vehículos */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Matrícula</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Marca</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Modelo</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Color</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Tipo</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Estado</th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items?.map((vehiculo) => {
              const vehiculoId = vehiculo._id;
              return (
                <tr key={vehiculoId} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-mono text-gray-800">{vehiculo.matricula}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{vehiculo.marca}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{vehiculo.modelo}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{vehiculo.color || '-'}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{vehiculo.tipo || '-'}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      vehiculo.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {vehiculo.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleEdit(vehiculo)}
                        className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                        title="Editar"
                        type="button"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleToggleActive(vehiculo)}
                        disabled={actionLoading === vehiculoId}
                        className={`p-1 transition-colors disabled:opacity-50 ${
                          vehiculo.activo ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'
                        }`}
                        title={vehiculo.activo ? 'Desactivar' : 'Activar'}
                        type="button"
                      >
                        {actionLoading === vehiculoId ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                        ) : vehiculo.activo ? (
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
            No hay vehículos registrados
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={selectedVehiculo ? 'Editar Vehículo' : 'Nuevo Vehículo'}>
        <VehiculoForm
          vehiculo={selectedVehiculo}
          onSuccess={() => {
            handleCloseModal();
            dispatch(fetchVehiculos());
          }}
          onCancel={handleCloseModal}
        />
      </Modal>
    </div>
  );
};

export default VehiculosList;