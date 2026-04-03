import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchClientes } from "../features/clientes/clientesSlice";
import { fetchEmpleados } from "../features/empleados/empleadosSlice";
import { fetchVehiculos } from "../features/vehiculos/vehiculosSlice";
import { fetchLavados } from "../features/lavados/lavadosSlice";
import { fetchTiposLavado } from "../features/tiposLavado/tiposLavadoSlice";
import { setFilters as setLavadosFilters } from "../features/lavados/lavadosSlice";
import Modal from "../components/ui/Modal";
import LavadoForm from "../components/forms/LavadoForm";
import ClienteForm from "../components/forms/ClienteForm";
import {
  FaUsers,
  FaCar,
  FaTint,
  FaClipboardList,
  FaUserFriends,
  FaMoneyBillWave,
  FaChartLine,
  FaCalendarDay,
  FaSpinner,
  FaCheckCircle,
  FaPlus,
  FaEye,
  FaClock,
  FaStar,
  FaChartBar,
} from "react-icons/fa";
import { format, startOfDay, endOfDay, subDays, subMonths } from "date-fns";
import { es } from "date-fns/locale";
import Button from "../components/ui/Button";
import toast from "react-hot-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items: clientes } = useSelector((state) => state.clientes);
  const { items: empleados } = useSelector((state) => state.empleados);
  const { items: vehiculos } = useSelector((state) => state.vehiculos);
  const { items: lavados } = useSelector((state) => state.lavados);
  const { items: tiposLavado } = useSelector((state) => state.tiposLavado);

  const [loading, setLoading] = useState(true);
  const [isLavadoModalOpen, setIsLavadoModalOpen] = useState(false);
  const [isClienteModalOpen, setIsClienteModalOpen] = useState(false);
  const [stats, setStats] = useState({
    lavadosHoy: 0,
    lavadosSemana: 0,
    lavadosMes: 0,
    ingresosHoy: 0,
    ingresosSemana: 0,
    ingresosMes: 0,
    clientesActivos: 0,
    clientesInactivos: 0,
    vehiculosRegistrados: 0,
    empleadosActivos: 0,
    serviciosActivos: 0,
    lavadosEnProceso: 0,
    lavadosPendientes: 0,
    lavadosCompletados: 0,
  });

  const [lavadosPorDia, setLavadosPorDia] = useState([]);
  const [serviciosPopulares, setServiciosPopulares] = useState([]);
  const [ingresosPorMes, setIngresosPorMes] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        dispatch(fetchClientes()),
        dispatch(fetchEmpleados()),
        dispatch(fetchVehiculos()),
        dispatch(fetchLavados()),
        dispatch(fetchTiposLavado()),
      ]);
      calcularEstadisticas();
      setLoading(false);
    };
    loadData();
  }, [dispatch]);

  const calcularEstadisticas = () => {
    const hoy = new Date();
    const inicioHoy = startOfDay(hoy);
    const finHoy = endOfDay(hoy);
    const inicioSemana = subDays(hoy, 7);
    const inicioMes = subMonths(hoy, 1);

    // Filtrar lavados por fechas
    const lavadosHoy =
      lavados?.filter(
        (l) =>
          l.horarioInicio &&
          new Date(l.horarioInicio) >= inicioHoy &&
          new Date(l.horarioInicio) <= finHoy,
      ) || [];

    const lavadosSemana =
      lavados?.filter(
        (l) => l.horarioInicio && new Date(l.horarioInicio) >= inicioSemana,
      ) || [];

    const lavadosMes =
      lavados?.filter(
        (l) => l.horarioInicio && new Date(l.horarioInicio) >= inicioMes,
      ) || [];

    // Calcular ingresos
    const ingresosHoy = lavadosHoy.reduce((sum, l) => sum + (l.total || 0), 0);
    const ingresosSemana = lavadosSemana.reduce(
      (sum, l) => sum + (l.total || 0),
      0
    );
    const ingresosMes = lavadosMes.reduce((sum, l) => sum + (l.total || 0), 0);

    // Contar lavados por estado
    const lavadosEnProceso =
      lavados?.filter((l) => l.estadoDelLavado === "En progreso" && l.activo !== false).length || 0;
    const lavadosPendientes =
      lavados?.filter((l) => l.estadoDelLavado === "Pendiente" && l.activo !== false).length || 0;
    const lavadosCompletados =
      lavados?.filter((l) => l.estadoDelLavado === "Terminado" && l.activo !== false).length || 0;

    // Calcular lavados por día para gráfico
    const ultimos7Dias = [];
    for (let i = 6; i >= 0; i--) {
      const fecha = subDays(hoy, i);
      const inicio = startOfDay(fecha);
      const fin = endOfDay(fecha);
      const count =
        lavados?.filter(
          (l) =>
            l.horarioInicio &&
            new Date(l.horarioInicio) >= inicio &&
            new Date(l.horarioInicio) <= fin,
        ).length || 0;
      ultimos7Dias.push({
        fecha: format(fecha, "dd/MM", { locale: es }),
        count,
      });
    }
    setLavadosPorDia(ultimos7Dias);

    // Calcular servicios más populares
    const serviciosCount = {};
    lavados?.forEach((lavado) => {
      lavado.tipoLavado?.forEach((tipo) => {
        const titulo = tipo.titulo;
        serviciosCount[titulo] = (serviciosCount[titulo] || 0) + 1;
      });
    });
    const topServicios = Object.entries(serviciosCount)
      .map(([titulo, count]) => ({ titulo, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    setServiciosPopulares(topServicios);

    // Calcular ingresos por mes (últimos 6 meses)
    const ultimos6Meses = [];
    for (let i = 5; i >= 0; i--) {
      const fecha = subMonths(hoy, i);
      const inicio = new Date(fecha.getFullYear(), fecha.getMonth(), 1);
      const fin = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0);
      const ingresos =
        lavados?.reduce((sum, l) => {
          const fechaLavado = new Date(l.horarioInicio);
          if (fechaLavado >= inicio && fechaLavado <= fin) {
            return sum + (l.total || 0);
          }
          return sum;
        }, 0) || 0;
      ultimos6Meses.push({
        mes: format(fecha, "MMM", { locale: es }),
        ingresos,
      });
    }
    setIngresosPorMes(ultimos6Meses);

    setStats({
      lavadosHoy: lavadosHoy.length,
      lavadosSemana: lavadosSemana.length,
      lavadosMes: lavadosMes.length,
      ingresosHoy,
      ingresosSemana,
      ingresosMes,
      clientesActivos: clientes?.filter((c) => c.activo).length || 0,
      clientesInactivos: clientes?.filter((c) => !c.activo).length || 0,
      vehiculosRegistrados: vehiculos?.length || 0,
      empleadosActivos: empleados?.filter((e) => e.activo).length || 0,
      serviciosActivos: tiposLavado?.filter((t) => t.activo).length || 0,
      lavadosEnProceso,
      lavadosPendientes,
      lavadosCompletados,
    });
  };

  // Función para navegar a lavados con filtro aplicado
  const navigateToLavadosWithFilter = (estado) => {
    dispatch(
      setLavadosFilters({
        estado: estado,
        searchTerm: "",
        cliente: "",
        vehiculo: "",
        tipoLavado: "",
        empleado: "",
        fechaInicio: "",
        fechaFin: "",
      })
    );
    navigate("/lavados");
  };

  const handleOpenLavadoModal = () => {
    setIsLavadoModalOpen(true);
  };

  const handleCloseLavadoModal = () => {
    setIsLavadoModalOpen(false);
  };

  const handleOpenClienteModal = () => {
    setIsClienteModalOpen(true);
  };

  const handleCloseClienteModal = () => {
    setIsClienteModalOpen(false);
  };

  const actions = [
    {
      title: "Nuevo Lavado",
      icon: <FaPlus />,
      color: "bg-blue-400",
      onClick: handleOpenLavadoModal,
    },
    {
      title: "Nuevo Cliente",
      icon: <FaUsers />,
      color: "bg-teal-400",
      onClick: handleOpenClienteModal, // Cambiado: ahora abre el modal
    },
    {
      title: "Ver Lavados",
      icon: <FaEye />,
      color: "bg-purple-400",
      onClick: () => navigate("/lavados"),
    },
    {
      title: "Ver Pendientes",
      icon: <FaClock />,
      color: "bg-amber-400",
      onClick: () => navigateToLavadosWithFilter("pendiente"),
    },
  ];

  const metricCards = [
    {
      title: "Lavados Hoy",
      value: stats.lavadosHoy,
      icon: <FaCalendarDay className="text-3xl text-blue-500" />,
      bgColor: "bg-blue-100",
    },
    {
      title: "Lavados Semana",
      value: stats.lavadosSemana,
      icon: <FaChartLine className="text-3xl text-green-500" />,
      bgColor: "bg-green-100",
    },
    {
      title: "Ingresos Hoy",
      value: `$${stats.ingresosHoy.toLocaleString()}`,
      icon: <FaMoneyBillWave className="text-3xl text-yellow-500" />,
      bgColor: "bg-yellow-100",
    },
    {
      title: "Ingresos Mes",
      value: `$${stats.ingresosMes.toLocaleString()}`,
      icon: <FaChartBar className="text-3xl text-purple-500" />,
      bgColor: "bg-purple-100",
    },
    {
      title: "Clientes Activos",
      value: stats.clientesActivos,
      icon: <FaUsers className="text-3xl text-indigo-500" />,
      bgColor: "bg-indigo-100",
    },
    {
      title: "Empleados",
      value: stats.empleadosActivos,
      icon: <FaUserFriends className="text-3xl text-pink-500" />,
      bgColor: "bg-pink-100",
    },
    {
      title: "Vehículos",
      value: stats.vehiculosRegistrados,
      icon: <FaCar className="text-3xl text-teal-500" />,
      bgColor: "bg-teal-100",
    },
    {
      title: "Servicios",
      value: stats.serviciosActivos,
      icon: <FaTint className="text-3xl text-cyan-500" />,
      bgColor: "bg-cyan-100",
    },
  ];

  const estadoCards = [
    {
      title: "En Proceso",
      value: stats.lavadosEnProceso,
      icon: <FaSpinner className="text-2xl text-yellow-500" />,
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      filter: "en-proceso",
    },
    {
      title: "Pendientes",
      value: stats.lavadosPendientes,
      icon: <FaClock className="text-2xl text-orange-500" />,
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      filter: "pendiente",
    },
    {
      title: "Completados",
      value: stats.lavadosCompletados,
      icon: <FaCheckCircle className="text-2xl text-green-500" />,
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      filter: "completado",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <div className="text-sm text-gray-500">
          {format(new Date(), "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
        </div>
      </div>

      {/* Acciones Rápidas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className={`${action.color} text-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 flex flex-col items-center gap-2`}
          >
            <div className="text-2xl">{action.icon}</div>
            <span className="text-sm font-medium">{action.title}</span>
          </button>
        ))}
      </div>

      {/* Métricas Principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricCards.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">{card.title}</p>
                <p className="text-2xl font-bold text-gray-800">{card.value}</p>
              </div>
              <div className={`${card.bgColor} p-3 rounded-full`}>
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Estado de Lavados - Click para filtrar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {estadoCards.map((card, index) => (
          <button
            key={index}
            onClick={() => navigateToLavadosWithFilter(card.filter)}
            className={`${card.bgColor} border ${card.borderColor} rounded-xl p-6 text-left hover:shadow-lg transition-all transform hover:scale-105 cursor-pointer w-full`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{card.title}</p>
                <p className="text-3xl font-bold text-gray-800">{card.value}</p>
              </div>
              {card.icon}
            </div>
          </button>
        ))}
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lavados por día */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaChartLine className="text-primary-500" />
            Lavados - Últimos 7 días
          </h2>
          <div className="flex items-end justify-between h-64 gap-2">
            {lavadosPorDia.map((dia, index) => (
              <div
                key={index}
                className="flex-1 flex flex-col items-center gap-2"
              >
                <div
                  className="w-full bg-primary-500 rounded-t-lg transition-all hover:bg-primary-600"
                  style={{
                    height: `${(dia.count / Math.max(...lavadosPorDia.map((d) => d.count), 1)) * 200}px`,
                  }}
                >
                  <div className="text-center text-white text-sm font-medium pt-1">
                    {dia.count > 0 && dia.count}
                  </div>
                </div>
                <span className="text-xs text-gray-500">{dia.fecha}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Ingresos por mes */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaMoneyBillWave className="text-primary-500" />
            Ingresos - Últimos 6 meses
          </h2>
          <div className="space-y-3">
            {ingresosPorMes.map((mes, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-16 text-sm text-gray-600">{mes.mes}</div>
                <div className="flex-1 bg-gray-200 rounded-full h-8 overflow-hidden">
                  <div
                    className="bg-green-500 h-full rounded-full flex items-center justify-end px-3 transition-all"
                    style={{
                      width: `${(mes.ingresos / Math.max(...ingresosPorMes.map((m) => m.ingresos), 1)) * 100}%`,
                    }}
                  >
                    <span className="text-white text-xs font-medium">
                      ${mes.ingresos.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Servicios Populares y Últimos Lavados */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Servicios más populares */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaStar className="text-yellow-500" />
            Servicios Más Populares
          </h2>
          <div className="space-y-3">
            {serviciosPopulares.map((servicio, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-gray-400">
                    #{index + 1}
                  </span>
                  <span className="text-gray-800">{servicio.titulo}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">
                    {servicio.count} lavados
                  </span>
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-500 h-2 rounded-full"
                      style={{
                        width: `${(servicio.count / serviciosPopulares[0]?.count) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
            {serviciosPopulares.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No hay datos suficientes
              </div>
            )}
          </div>
        </div>

        {/* Últimos lavados */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaClipboardList className="text-primary-500" />
            Últimos Lavados
          </h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {lavados?.slice(0, 5).map((lavado) => (
              <div
                key={lavado._id}
                onClick={() => navigate(`/lavados/${lavado._id}`)}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <div>
                  <p className="font-medium text-gray-800">
                    {lavado.clienteId?.nombre || "-"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {lavado.vehiculoId?.matricula} -{" "}
                    {lavado.tipoLavado.map((t) => t.titulo).join(", ")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-800">
                    ${(lavado.total || 0).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">
                    {lavado.fechaLavado &&
                      format(new Date(lavado.fechaLavado), "dd/MM/yyyy", {
                        locale: es,
                      })}
                  </p>
                </div>
              </div>
            ))}
            {lavados?.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No hay lavados registrados
              </div>
            )}
          </div>
          <div className="mt-4 text-center">
            <Button
              variant="outline"
              onClick={() => navigate("/lavados")}
              className="text-sm"
            >
              Ver todos los lavados
            </Button>
          </div>
        </div>
      </div>

      {/* Modal para crear nuevo lavado */}
      <Modal
        isOpen={isLavadoModalOpen}
        onClose={handleCloseLavadoModal}
        title="Nuevo Lavado"
      >
        <LavadoForm
          onSuccess={() => {
            handleCloseLavadoModal();
            dispatch(fetchLavados());
            toast.success("Lavado registrado exitosamente");
          }}
          onCancel={handleCloseLavadoModal}
        />
      </Modal>

      {/* Modal para crear nuevo cliente */}
      <Modal
        isOpen={isClienteModalOpen}
        onClose={handleCloseClienteModal}
        title="Nuevo Cliente"
      >
        <ClienteForm
          onSuccess={() => {
            handleCloseClienteModal();
            dispatch(fetchClientes());
            toast.success("Cliente registrado exitosamente");
          }}
          onCancel={handleCloseClienteModal}
        />
      </Modal>
    </div>
  );
};

export default Dashboard;