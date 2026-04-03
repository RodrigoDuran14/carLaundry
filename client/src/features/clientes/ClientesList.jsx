import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchClientes, toggleActiveCliente, findClientes, findClientesByVehiculo, setFilters, setSearchType, clearFilters } from './clientesSlice';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import ClienteForm from '../../components/forms/ClienteForm';
import AddVehiculoForm from '../../components/forms/AddVehiculoForm';
import { FaEdit, FaCheckCircle, FaBan, FaSearch, FaUserPlus, FaCar, FaTimes, FaFilter } from 'react-icons/fa';
import toast from 'react-hot-toast';

const ClientesList = () => {
  const dispatch = useDispatch();
  const { items, loading, filters, searchType } = useSelector((state) => state.clientes);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVehiculoModalOpen, setIsVehiculoModalOpen] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionLoading, setActionLoading] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    dispatch(fetchClientes());
  }, [dispatch]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchTerm) {
        if (searchType === 'vehiculo') {
          dispatch(findClientesByVehiculo({ [searchType]: searchTerm }));
        } else {
          dispatch(findClientes({ [searchType]: searchTerm }));
        }
      } else {
        dispatch(fetchClientes());
      }
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm, searchType, dispatch]);

  const handleOpenModal = (cliente = null) => {
    setSelectedCliente(cliente);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCliente(null);
  };

  const handleOpenVehiculoModal = (cliente) => {
    setSelectedCliente(cliente);
    setIsVehiculoModalOpen(true);
  };

  const handleCloseVehiculoModal = () => {
    setIsVehiculoModalOpen(false);
    setSelectedCliente(null);
  };

  const handleEdit = (cliente) => {
    const clienteId = cliente._id;
    if (!clienteId) {
      toast.error('Error: Cliente sin ID válido');
      return;
    }
    handleOpenModal({ ...cliente, _id: clienteId });
  };

  const handleToggleActive = async (cliente) => {
    const clienteId = cliente._id;
    if (!clienteId) return;
    
    setActionLoading(clienteId);
    try {
      await dispatch(toggleActiveCliente(clienteId)).unwrap();
      dispatch(fetchClientes());
    } catch (error) {
      toast.error('Error al cambiar estado');
    } finally {
      setActionLoading(null);
    }
  };

  const handleSearchTypeChange = (e) => {
    const newType = e.target.value;
    dispatch(setSearchType(newType));
    setSearchTerm('');
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
    setSearchTerm('');
  };

  if (loading && items.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const searchPlaceholders = {
    nombre: 'Buscar por nombre...',
    dni: 'Buscar por DNI...',
    celular: 'Buscar por teléfono...',
    vehiculo: 'Buscar por marca, modelo o matrícula...',
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-xl font-semibold text-gray-800">Lista de Clientes</h2>
        <Button onClick={() => handleOpenModal()} className="flex items-center gap-2">
          <FaUserPlus />
          Nuevo Cliente
        </Button>
      </div>

      {/* Barra de búsqueda y filtros */}
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
            <option value="celular">Buscar por teléfono</option>
            <option value="vehiculo">Buscar por vehículo</option>
          </select>
          {(searchTerm || filters.nombre || filters.dni || filters.celular) && (
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

      {/* Tabla de clientes */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Nombre</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">DNI</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Email</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Teléfono</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Vehículos</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Estado</th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items?.map((cliente) => {
              const clienteId = cliente._id;
              const vehiculos = cliente.vehiculo || [];
              return (
                <tr key={clienteId} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm text-gray-800">{cliente.nombre}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{cliente.dni}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{cliente.mail || '-'}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{cliente.celular}</td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex flex-wrap gap-1">
                      {vehiculos.slice(0, 2).map((v) => (
                        <span key={v._id } className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100">
                          <FaCar className="mr-1 text-xs" /> {v.matricula}
                        </span>
                      ))}
                      {vehiculos.length > 2 && (
                        <span className="text-xs text-gray-500">+{vehiculos.length - 2}</span>
                      )}
                      <button
                        onClick={() => handleOpenVehiculoModal(cliente)}
                        className="text-primary-600 hover:text-primary-800 text-xs ml-1"
                        title="Agregar vehículo"
                      >
                        + Agregar
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      cliente.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {cliente.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleEdit(cliente)}
                        className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                        title="Editar"
                        type="button"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleToggleActive(cliente)}
                        disabled={actionLoading === clienteId}
                        className={`p-1 transition-colors disabled:opacity-50 ${
                          cliente.activo ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'
                        }`}
                        title={cliente.activo ? 'Desactivar' : 'Activar'}
                        type="button"
                      >
                        {actionLoading === clienteId ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                        ) : cliente.activo ? (
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
            No hay clientes registrados
          </div>
        )}
      </div>

      {/* Modal Cliente */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={selectedCliente ? 'Editar Cliente' : 'Nuevo Cliente'}>
        <ClienteForm
          cliente={selectedCliente}
          onSuccess={() => {
            handleCloseModal();
            dispatch(fetchClientes());
          }}
          onCancel={handleCloseModal}
        />
      </Modal>

      {/* Modal Agregar Vehículo */}
      <Modal isOpen={isVehiculoModalOpen} onClose={handleCloseVehiculoModal} title="Agregar Vehículo">
        <AddVehiculoForm
          cliente={selectedCliente}
          onSuccess={() => {
            handleCloseVehiculoModal();
            dispatch(fetchClientes());
          }}
          onCancel={handleCloseVehiculoModal}
        />
      </Modal>
    </div>
  );
};

export default ClientesList;