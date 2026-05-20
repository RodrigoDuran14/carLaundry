import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchLavados,
  setFilters,
  clearFilters,
  toggleActiveLavado,
} from "./lavadosSlice";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import LavadoForm from "../../components/forms/LavadoForm";
import {
  FaEye,
  FaSearch,
  FaPlus,
  FaFilter,
  FaTimes,
  FaTrash,
  FaUndo,
  FaUser,
  FaCar,
  FaTint,
  FaUserFriends,
} from "react-icons/fa";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import toast from "react-hot-toast";

const LavadosList = () => {
  const dispatch = useDispatch();
  const { filteredItems, loading, filters } = useSelector(
    (state) => state.lavados,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [localSearchTerm, setLocalSearchTerm] = useState(
    filters.searchTerm || "",
  );
  const [showFilters, setShowFilters] = useState(false);
  const [fechas, setFechas] = useState({
    fechaInicio: filters.fechaInicio || "",
    fechaFin: filters.fechaFin || "",
  });
  const [actionLoading, setActionLoading] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchLavados());
  }, [dispatch]);

  // Debounce para búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearchTerm !== filters.searchTerm) {
        dispatch(setFilters({ searchTerm: localSearchTerm }));
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [localSearchTerm, filters.searchTerm, dispatch]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleFilterChange = (filterName, value) => {
    dispatch(setFilters({ [filterName]: value }));
  };

  const handleFechaChange = (e) => {
    const { name, value } = e.target;
    setFechas({ ...fechas, [name]: value });
    dispatch(setFilters({ [name]: value }));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
    setLocalSearchTerm("");
    setFechas({ fechaInicio: "", fechaFin: "" });
  };

  const handleViewDetail = (id) => {
    navigate(`/lavados/${id}`);
  };

  const handleToggleActive = async (lavado) => {
    const lavadoId = lavado._id;
    setActionLoading(lavadoId);
    try {
      await dispatch(toggleActiveLavado(lavadoId)).unwrap();
      dispatch(fetchLavados());
    } catch (error) {
      toast.error("Error al cambiar estado");
    } finally {
      setActionLoading(null);
    }
  };

  const getEstadoBadge = (lavado) => {
    if (!lavado.activo) {
      return { text: "Archivado", className: "bg-gray-100 text-gray-800" };
    }

    switch (lavado.estadoDelLavado) {
      case "Terminado":
        return { text: "Completado", className: "bg-green-100 text-green-800" };
      case "En progreso":
        return {
          text: "En Proceso",
          className: "bg-yellow-100 text-yellow-800",
        };
      case "Pendiente":
        return { text: "Pendiente", className: "bg-blue-100 text-blue-800" };
      default:
        return {
          text: lavado.estadoDelLavado || "Desconocido",
          className: "bg-gray-100 text-gray-800",
        };
    }
  };

  // Verificar si hay filtros activos
  const hasActiveFilters = () => {
    return (
      filters.estado !== "todos" ||
      filters.searchTerm ||
      filters.fechaInicio ||
      filters.fechaFin ||
      filters.cliente ||
      filters.vehiculo ||
      filters.tipoLavado ||
      filters.empleado
    );
  };

  if (loading && filteredItems?.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Historial de Lavados
        </h2>
        <Button onClick={handleOpenModal} className="flex items-center gap-2">
          <FaPlus />
          Nuevo Lavado
        </Button>
      </div>

      {/* Barra de búsqueda y botón de filtros */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por cliente o matrícula..."
              value={localSearchTerm}
              onChange={(e) => setLocalSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
              showFilters || hasActiveFilters()
                ? "bg-primary-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            <FaFilter />
            Filtros
            {hasActiveFilters() && (
              <span className="ml-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                !
              </span>
            )}
          </button>
          {hasActiveFilters() && (
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors flex items-center gap-2"
            >
              <FaTimes />
              Limpiar filtros
            </button>
          )}
        </div>

        {/* Panel de filtros expandible */}
        {showFilters && (
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Filtro por Estado */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Estado
                </label>
                <select
                  value={filters.estado}
                  onChange={(e) => handleFilterChange("estado", e.target.value)}
                  className="input"
                >
                  <option value="todos">Todos</option>
                  <option value="pendiente">Pendientes</option>
                  <option value="en-proceso">En Proceso</option>
                  <option value="completado">Completados</option>
                </select>
              </div>

              {/* Filtro por Fecha desde */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Fecha desde
                </label>
                <input
                  type="date"
                  name="fechaInicio"
                  value={fechas.fechaInicio}
                  onChange={handleFechaChange}
                  className="input"
                />
              </div>

              {/* Filtro por Fecha hasta */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Fecha hasta
                </label>
                <input
                  type="date"
                  name="fechaFin"
                  value={fechas.fechaFin}
                  onChange={handleFechaChange}
                  className="input"
                />
              </div>

              {/* Filtro por Cliente */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  <FaUser className="text-sm" />
                  Cliente
                </label>
                <input
                  type="text"
                  placeholder="Nombre del cliente..."
                  value={filters.cliente}
                  onChange={(e) =>
                    handleFilterChange("cliente", e.target.value)
                  }
                  className="input"
                />
              </div>

              {/* Filtro por Vehículo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  <FaCar className="text-sm" />
                  Vehículo
                </label>
                <input
                  type="text"
                  placeholder="Matrícula del vehículo..."
                  value={filters.vehiculo}
                  onChange={(e) =>
                    handleFilterChange("vehiculo", e.target.value)
                  }
                  className="input"
                />
              </div>

              {/* Filtro por Tipo de Lavado */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  <FaTint className="text-sm" />
                  Tipo de Lavado
                </label>
                <input
                  type="text"
                  placeholder="Nombre del servicio..."
                  value={filters.tipoLavado}
                  onChange={(e) =>
                    handleFilterChange("tipoLavado", e.target.value)
                  }
                  className="input"
                />
              </div>

              {/* Filtro por Empleado */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  <FaUserFriends className="text-sm" />
                  Empleado
                </label>
                <input
                  type="text"
                  placeholder="Nombre del empleado..."
                  value={filters.empleado}
                  onChange={(e) =>
                    handleFilterChange("empleado", e.target.value)
                  }
                  className="input"
                />
              </div>
            </div>

            {/* Indicador de filtros activos */}
            {hasActiveFilters() && (
              <div className="mt-4 pt-3 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  Filtros activos:
                  {filters.estado !== "todos" && (
                    <span className="ml-1 inline-flex items-center px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-800">
                      Estado: {filters.estado}
                    </span>
                  )}
                  {filters.cliente && (
                    <span className="ml-1 inline-flex items-center px-2 py-0.5 rounded text-xs bg-purple-100 text-purple-800">
                      Cliente: {filters.cliente}
                    </span>
                  )}
                  {filters.vehiculo && (
                    <span className="ml-1 inline-flex items-center px-2 py-0.5 rounded text-xs bg-indigo-100 text-indigo-800">
                      Vehículo: {filters.vehiculo}
                    </span>
                  )}
                  {filters.tipoLavado && (
                    <span className="ml-1 inline-flex items-center px-2 py-0.5 rounded text-xs bg-cyan-100 text-cyan-800">
                      Servicio: {filters.tipoLavado}
                    </span>
                  )}
                  {filters.empleado && (
                    <span className="ml-1 inline-flex items-center px-2 py-0.5 rounded text-xs bg-pink-100 text-pink-800">
                      Empleado: {filters.empleado}
                    </span>
                  )}
                  {filters.fechaInicio && (
                    <span className="ml-1 inline-flex items-center px-2 py-0.5 rounded text-xs bg-green-100 text-green-800">
                      Desde: {filters.fechaInicio}
                    </span>
                  )}
                  {filters.fechaFin && (
                    <span className="ml-1 inline-flex items-center px-2 py-0.5 rounded text-xs bg-green-100 text-green-800">
                      Hasta: {filters.fechaFin}
                    </span>
                  )}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Tabla de resultados */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                Cliente
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                Vehículo
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                Servicio
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                Empleados
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                Inicio
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                Estado
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredItems?.map((lavado) => {
              const estadoBadge = getEstadoBadge(lavado);
              const empleadosNombres =
                lavado.lavador?.map((e) => e.nombre).join(", ") || "-";
              const servicioNombre =
                lavado.tipoLavado.map(t=>t.titulo).join(', ') || '-'

              return (
                <tr key={lavado._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-800">
                    {lavado.clienteId?.nombre || "-"}
                  </td>
                  <td className="px-4 py-3 text-sm font-mono text-gray-600">
                    {lavado.vehiculoId?.matricula || "-"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {servicioNombre}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {empleadosNombres}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {lavado.horarioInicio &&
                      format(
                        new Date(lavado.horarioInicio),
                        "dd/MM/yyyy HH:mm",
                        { locale: es },
                      )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${estadoBadge.className}`}
                    >
                      {estadoBadge.text}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleViewDetail(lavado._id)}
                        className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                        title="Ver detalles"
                        type="button"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => handleToggleActive(lavado)}
                        disabled={actionLoading === lavado._id}
                        className={`p-1 transition-colors disabled:opacity-50 ${
                          lavado.activo
                            ? "text-red-600 hover:text-red-800"
                            : "text-green-600 hover:text-green-800"
                        }`}
                        title={lavado.activo ? "Archivar" : "Restaurar"}
                        type="button"
                      >
                        {actionLoading === lavado._id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                        ) : lavado.activo ? (
                          <FaTrash />
                        ) : (
                          <FaUndo />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filteredItems?.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No hay lavados que coincidan con los filtros seleccionados
          </div>
        )}

        {/* Modal para crear nuevo lavado */}
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title="Nuevo Lavado"
        >
          <LavadoForm
            onSuccess={() => {
              handleCloseModal();
              dispatch(fetchLavados());
              toast.success("Lavado registrado exitosamente");
            }}
            onCancel={handleCloseModal}
          />
        </Modal>
      </div>
    </div>
  );
};
export default LavadosList;
