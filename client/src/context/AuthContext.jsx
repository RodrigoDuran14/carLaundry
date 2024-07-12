import { createContext, useContext, useState, useEffect } from "react";
import { verifyToken } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      verifyToken(token)
        .then(response => {
          if (response.data.valid) {
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setIsAuthenticated(false);
          }
        })
        .catch(error => {
          console.error('Error verifying token:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setIsAuthenticated(false);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);