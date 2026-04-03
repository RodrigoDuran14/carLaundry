import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLavadoById, finalizarLavado, notificarLavado } from '../features/lavados/lavadosSlice';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import IniciarLavadoForm from '../components/forms/IniciarLavadoForm';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { FaArrowLeft, FaPlay, FaCheck, FaUser, FaCar, FaTint, FaClock, FaCalendar, FaWhatsapp } from 'react-icons/fa';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import toast from 'react-hot-toast';

const LavadoDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedLavado: lavado, loading } = useSelector((state) => state.lavados);
  const [isIniciarModalOpen, setIsIniciarModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchLavadoById(id));
    }
  }, [dispatch, id]);

  const handleIniciar = () => {
    setIsIniciarModalOpen(true);
  };

  const handleFinalizar = async () => {
    try {
      await dispatch(finalizarLavado(id)).unwrap();
      toast.success('Lavado finalizado');
      dispatch(fetchLavadoById(id));
    } catch (error) {
      toast.error('Error al finalizar el lavado');
    }
  };

  const handleNotificar = () => {
    dispatch(notificarLavado(id));
  };

  if (loading || !lavado) {
    return <LoadingSpinner />;
  }

  const isPendiente = lavado.estadoDelLavado === 'Pendiente';
  const isEnProceso = lavado.estadoDelLavado === 'En progreso';
  const isCompletado = lavado.estadoDelLavado === 'Terminado';
  const servicio = lavado.tipoLavado?.[0] || {};
  const empleados = lavado.lavador || [];

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={() => navigate('/lavados')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
      >
        <FaArrowLeft />
        Volver a lavados
      </button>

      <div className="card">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Detalle del Lavado</h1>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            isCompletado
              ? 'bg-green-100 text-green-800'
              : isEnProceso
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-blue-100 text-blue-800'
          }`}>
            {isCompletado ? 'Completado' : isEnProceso ? 'En Proceso' : 'Pendiente'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <FaUser className="text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Cliente</p>
                <p className="font-medium">{lavado.clienteId?.nombre || '-'}</p>
                <p className="text-sm text-gray-600">DNI: {lavado.clienteId?.dni || '-'}</p>
                {lavado.clienteId?.celular && (
                  <p className="text-sm text-gray-600">Tel: {lavado.clienteId?.celular}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <FaCar className="text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Vehículo</p>
                <p className="font-medium">{lavado.vehiculoId?.marca} {lavado.vehiculoId?.modelo}</p>
                <p className="text-sm text-gray-600">Matrícula: {lavado.vehiculoId?.matricula}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <FaTint className="text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Servicios</p>
                {lavado.tipoLavado?.map((t, idx) => (
                  <p key={idx} className="font-medium">{t.titulo || t.nombre}</p>
                ))}
                <p className="text-sm text-gray-600">Total: ${lavado.total?.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <FaUser className="text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Lavadores</p>
                {empleados.map((emp) => (
                  <p key={emp._id} className="font-medium">{emp.nombre}</p>
                ))}
                {empleados.length === 0 && <p className="text-gray-500">Sin asignar</p>}
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <FaCalendar className="text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Fecha Registro</p>
                <p className="font-medium">
                  {lavado.createdAt && format(new Date(lavado.createdAt), 'dd/MM/yyyy', { locale: es })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <FaClock className="text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Horario</p>
                <p className="font-medium">
                  {lavado.horarioInicio ? format(new Date(lavado.horarioInicio), 'HH:mm', { locale: es }) : 'No iniciado'}
                  {lavado.horarioFin && ` - ${format(new Date(lavado.horarioFin), 'HH:mm', { locale: es })}`}
                </p>
              </div>
            </div>
          </div>
        </div>

        {lavado.observaciones && (
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm font-medium text-yellow-800 mb-1">Observaciones</p>
            <p className="text-sm text-yellow-700">{lavado.observaciones}</p>
          </div>
        )}

        <div className="mt-8 flex flex-wrap gap-3 justify-end">
          {isCompletado && lavado.clienteId?.celular && (
            <Button onClick={handleNotificar} variant="outline" className="flex items-center gap-2 border-green-500 text-green-600">
              <FaWhatsapp />
              Notificar
            </Button>
          )}
          {isPendiente && (
            <Button onClick={handleIniciar} className="flex items-center gap-2">
              <FaPlay />
              Iniciar Lavado
            </Button>
          )}
          {isEnProceso && (
            <Button onClick={handleFinalizar} className="flex items-center gap-2 bg-green-600 hover:bg-green-700">
              <FaCheck />
              Finalizar Lavado
            </Button>
          )}
        </div>
      </div>

      {/* Modal para iniciar lavado */}
      <Modal
        isOpen={isIniciarModalOpen}
        onClose={() => setIsIniciarModalOpen(false)}
        title="Iniciar Lavado - Asignar Lavadores"
      >
        <IniciarLavadoForm
          lavado={lavado}
          onSuccess={() => {
            setIsIniciarModalOpen(false);
            dispatch(fetchLavadoById(id));
            toast.success('Lavado iniciado');
          }}
          onCancel={() => setIsIniciarModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default LavadoDetail;