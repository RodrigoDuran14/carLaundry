import { NavLink } from 'react-router-dom';
import { 
  FaTachometerAlt, 
  FaUsers, 
  FaUserFriends, 
  FaCar, 
  FaTint, 
  FaClipboardList,
  FaSignOutAlt,
  FaTimes
} from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';

const Sidebar = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();

  const menuItems = [
    { path: '/', name: 'Dashboard', icon: <FaTachometerAlt /> },
    { path: '/clientes', name: 'Clientes', icon: <FaUsers /> },
    { path: '/empleados', name: 'Empleados', icon: <FaUserFriends /> },
    { path: '/vehiculos', name: 'Vehículos', icon: <FaCar /> },
    { path: '/tipos-lavado', name: 'Tipos de Lavado', icon: <FaTint /> },
    { path: '/lavados', name: 'Lavados', icon: <FaClipboardList /> },
  ];

  const handleLogout = () => {
    dispatch(logout());
    onClose();
  };

  return (
    <>
      {/* Overlay para móvil - mismo estilo que el modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 md:hidden transition-all duration-300 bg-gradient-to-br from-black/70 to-black/50 backdrop-blur-sm animate-fade-in"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-gray-900 text-white w-64 transform transition-transform duration-300 ease-in-out z-30 shadow-2xl
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <FaCar className="text-primary-500 text-2xl" />
              <h1 className="text-xl font-bold">CarLaundry</h1>
            </div>
            {/* Botón cerrar sidebar - solo visible en móvil */}
            <button
              onClick={onClose}
              className="md:hidden text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-gray-800"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>

          <nav className="space-y-1">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-primary-600 text-white shadow-lg'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`
                }
              >
                {item.icon}
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>

          <div className="absolute bottom-6 left-0 right-0 px-6">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-all duration-200"
            >
              <FaSignOutAlt />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;