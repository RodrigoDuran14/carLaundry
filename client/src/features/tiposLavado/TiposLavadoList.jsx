import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTiposLavado, toggleActiveTipoLavado, findTiposLavado, setSearchType, clearFilters } from './tiposLavadoSlice';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import TipoLavadoForm from '../../components/forms/TipoLavadoForm';
import { FaEdit, FaCheckCircle, FaBan, FaSearch, FaTint, FaPlus, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';

const TiposLavadoList = () => {
  const dispatch = useDispatch();
  const { items, loading, searchType } = useSelector((state) => state.tiposLavado);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTipo, setSelectedTipo] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    dispatch(fetchTiposLavado());
  }, [dispatch]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchTerm) {
        dispatch(findTiposLavado({ [searchType]: searchTerm }));
      } else {
        dispatch(fetchTiposLavado());
      }
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm, searchType, dispatch]);

  const handleOpenModal = (tipo = null) => {
    setSelectedTipo(tipo);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTipo(null);
  };

  const handleEdit = (tipo) => {
    const tipoId = tipo._id;
    if (!tipoId) {
      toast.error('Error: Tipo de lavado sin ID válido');
      return;
    }
    handleOpenModal({ ...tipo, _id: tipoId });
  };

  const handleToggleActive = async (tipo) => {
    const tipoId = tipo._id;
    if (!tipoId) return;
    
    setActionLoading(tipoId);
    try {
      await dispatch(toggleActiveTipoLavado(tipoId)).unwrap();
      dispatch(fetchTiposLavado());
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
    titulo: 'Buscar por título...',
    descripcion: 'Buscar por descripción...',
  };

  if (loading && items?.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-xl font-semibold text-gray-800">Tipos de Lavado</h2>
        <Button onClick={() => handleOpenModal()} className="flex items-center gap-2">
          <FaPlus />
          Nuevo Tipo
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
            <option value="titulo">Buscar por título</option>
            <option value="descripcion">Buscar por descripción</option>
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

      {/* Grid de tipos de lavado */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items?.map((tipo) => {
          const tipoId = tipo._id;
          return (
            <div key={tipoId} className="card hover:shadow-lg transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-primary-100 p-2 rounded-lg">
                    <FaTint className="text-primary-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{tipo.nombre || tipo.titulo}</h3>
                    <p className="text-sm text-gray-500">Duración: {tipo.duracion} min</p>
                  </div>
                </div>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  tipo.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {tipo.activo ? 'Activo' : 'Inactivo'}
                </span>
              </div>
              
              <p className="text-gray-600 text-sm mb-3">{tipo.descripcion || 'Sin descripción'}</p>
              
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <span className="text-2xl font-bold text-primary-600">
                  ${tipo.precio?.toLocaleString()}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(tipo)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleToggleActive(tipo)}
                    disabled={actionLoading === tipoId}
                    className={`p-2 rounded-lg transition-colors disabled:opacity-50 ${
                      tipo.activo ? 'text-red-600 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'
                    }`}
                    title={tipo.activo ? 'Desactivar' : 'Activar'}
                  >
                    {actionLoading === tipoId ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                    ) : tipo.activo ? (
                      <FaBan />
                    ) : (
                      <FaCheckCircle />
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {items?.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No hay tipos de lavado registrados
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={selectedTipo ? 'Editar Tipo de Lavado' : 'Nuevo Tipo de Lavado'}>
        <TipoLavadoForm
          tipo={selectedTipo}
          onSuccess={() => {
            handleCloseModal();
            dispatch(fetchTiposLavado());
          }}
          onCancel={handleCloseModal}
        />
      </Modal>
    </div>
  );
};

export default TiposLavadoList;