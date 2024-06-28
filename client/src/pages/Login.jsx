import React, { useState } from "react";
import { login } from "../services/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/other/login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { setIsAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login({ mail: email, password });
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.empleado));
        setIsAuthenticated(true);
        navigate("/home");
        toast.success("Inicio de sesión exitoso");
      } else {
        setError("Inicio de sesión fallido");
        toast.error(
          "Error al iniciar sesión. Verifica tus credenciales e intenta nuevamente."
        );
      }
    } catch (error) {
      setError(error.response.data.error);
      toast.error(
        "Error al iniciar sesión. Verifica tus credenciales e intenta nuevamente."
      );
    }
  };

  return (
    <>
      <h2>Iniciar Sesión</h2>
      <div className="containerlogin">
        <form onSubmit={handleSubmit}>
          <div>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Contraseña:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p>{error}</p>}
          <button type="submit">Iniciar Sesión</button>
        </form>
      </div>
    </>
  );
};

export default Login;
