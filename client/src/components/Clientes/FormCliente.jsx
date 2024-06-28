import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postClient} from "../../services/api";
import BuscadorVehiculos from "../Vehiculos/BuscadorVehiculos";
import { toast } from "react-toastify";
import "../../styles/clientes/FormCliente.css"

const FormCliente = ({ onCreate }) => {
  const [form, setForm] = useState({
    nombre: "",
    dni: 0,
    celular: 0,
    mail: "",
    vehiculoId: "",
  });

  const navigate = useNavigate()

  const [showVehiculos, setShowVehiculos] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectVehiculo = (vehiculo) => {
    try {
      setForm({
        ...form,
        vehiculoId: vehiculo._id,
      });
      setShowVehiculos(false);
      toast.success("Vehiculo seleccionado correctamente")
    } catch (error) {
      toast.error("Error al seleccionar vehiculo")
    }
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      if (
        !form.nombre ||
        !form.dni ||
        !form.celular ||
        !form.mail ||
        !form.vehiculoId
      ) {
        toast.error("Todos los campos son obligatorios");
        return
      }
      await postClient(form);
      onCreate();
      toast.success("Nuevo cliente creado con exito")
      navigate("/clientes");
    } catch (error) {
      toast.error("Error al crear nuevo cliente")
    }
  };
  return (
    <div className="form-container">
      <h2>Nuevo Cliente</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="nombre"
          type="text"
          placeholder="Nombre"
          onChange={handleChange}
        />
        <input
          name="dni"
          type="number"
          placeholder="DNI"
          onChange={handleChange}
        />
        <input
          name="celular"
          type="number"
          placeholder="Celular"
          onChange={handleChange}
        />
        <input
          name="mail"
          type="text"
          placeholder="Mail"
          onChange={handleChange}
        />
        <button type="button" onClick={() => setShowVehiculos(!showVehiculos)}>
          Seleccionar Vehiculo
        </button>
        {showVehiculos && (<div className="buscador">
          <BuscadorVehiculos onSelect={handleSelectVehiculo} />
          <button onClick={()=>navigate("/vehiculo-nuevo")}>Agregar Vehiculo</button>
        </div>)}
        
        <button type="submit">Agregar Cliente</button>
      </form>
    </div>
  );
};

export default FormCliente;
