import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import { FaCar, FaUser, FaUsers, FaClipboardList, FaTint, FaSignOutAlt, FaBars } from 'react-icons/fa';

const Navbar = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const navItems = [
    { path: '/', name: 'Dashboard', icon: <FaCar className="mr-2" /> },
    { path: '/clientes', name: 'Clientes', icon: <FaUser className="mr-2" /> },
    { path: '/empleados', name: 'Empleados', icon: <FaUsers className="mr-2" /> },
    { path: '/vehiculos', name: 'Vehículos', icon: <FaCar className="mr-2" /> },
    { path: '/tipos-lavado', name: 'Tipos de Lavado', icon: <FaTint className="mr-2" /> },
    { path: '/lavados', name: 'Lavados', icon: <FaClipboardList className="mr-2" /> },
  ];

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-40">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {/* Botón hamburguesa solo visible en móvil */}
            <button
              onClick={onMenuClick}
              className="md:hidden mr-4 text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              <FaBars className="text-2xl" />
            </button>
            
            <Link to="/" className="flex items-center space-x-2">
              <FaCar className="text-primary-600 text-2xl" />
              <span className="font-bold text-xl text-gray-800">CarLaundry</span>
            </Link>
          </div>

          {/* Desktop menu - visible en md y superiores */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-colors"
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
            
            <div className="border-l pl-4 ml-2 flex items-center space-x-3">
              <span className="text-sm text-gray-600">
                {user?.nombre || 'Usuario'}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center text-red-600 hover:text-red-700 transition-colors"
              >
                <FaSignOutAlt className="mr-1" />
                <span className="text-sm">Salir</span>
              </button>
            </div>
          </div>

          {/* Mobile menu button - solo visible en móvil (ya está arriba) */}
          <div className="md:hidden flex items-center">
            {/* Aquí podría ir un botón de perfil si se desea */}
          </div>
        </div>

        {/* Mobile dropdown menu - visible solo en móvil cuando está abierto */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-100">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-colors"
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
            <div className="border-t mt-2 pt-2">
              <div className="px-3 py-2 text-sm text-gray-600">
                {user?.nombre || 'Usuario'}
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
              >
                <FaSignOutAlt className="mr-2" />
                Salir
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;