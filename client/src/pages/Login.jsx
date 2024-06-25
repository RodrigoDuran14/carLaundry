import React, { useState } from 'react';
import { login } from '../services/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'; 
import "../styles/other/login.css"

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login( { mail: email, password });
      const { token, empleado } = response.data;
      localStorage.setItem('token', token); 
      
      localStorage.setItem('user', JSON.stringify(empleado));

      navigate('/home');
      toast.success('Inicio de sesión exitoso');
    } catch (error) {
      setError(error.response.data.error);
      toast.error('Error al iniciar sesión. Verifica tus credenciales e intenta nuevamente.');
    }
  };

  return (
    <>
      <h2>Iniciar Sesión</h2>
    <div className='containerlogin'>
      {error && <div>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Contraseña:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit">Iniciar Sesión</button>
      </form>
    </div>
    </>
  );
};

export default Login;