import { useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

const Modal = ({ isOpen, onClose, title, children, size = 'md', showCloseButton = true }) => {
  // Prevenir scroll cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Manejar tecla ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
    }
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Tamaños del modal
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[90vw]',
  };

  return (
    <div 
      className="fixed inset-0 z-[9999] overflow-y-auto"
      onClick={handleBackdropClick}
    >
      {/* Fondo con blur y opacidad - gradiente oscuro */}
      <div className="fixed inset-0 bg-gradient-to-br from-black/70 to-black/50 backdrop-blur-sm transition-all duration-300" />
      
      <div className="flex items-center justify-center min-h-screen p-4">
        <div 
          className={`relative bg-white rounded-2xl shadow-2xl w-full ${sizes[size]} mx-auto transform transition-all duration-300 animate-slide-in`}
        >
          {/* Header con diseño moderno */}
          <div className="relative">
            {/* Barra decorativa superior */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600 rounded-t-2xl" />
            
            <div className="flex justify-between items-center p-5 bg-white rounded-t-2xl">
              <div className="flex items-center gap-3">
                {/* Icono decorativo */}
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
              </div>
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="group relative w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 hover:bg-gray-100 transition-all duration-200"
                >
                  <FaTimes className="text-gray-400 group-hover:text-gray-600 text-sm transition-colors" />
                  <span className="absolute -top-8 right-0 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    ESC
                  </span>
                </button>
              )}
            </div>
          </div>
          
          {/* Content con scroll si es necesario */}
          <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;