import { configureStore } from '@reduxjs/toolkit';
import clientesReducer from '../features/clientes/clientesSlice';
import empleadosReducer from '../features/empleados/empleadosSlice';
import vehiculosReducer from '../features/vehiculos/vehiculosSlice';
import tiposLavadoReducer from '../features/tiposLavado/tiposLavadoSlice';
import lavadosReducer from '../features/lavados/lavadosSlice';
import authReducer from '../features/auth/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    clientes: clientesReducer,
    empleados: empleadosReducer,
    vehiculos: vehiculosReducer,
    tiposLavado: tiposLavadoReducer,
    lavados: lavadosReducer,
  },
});

