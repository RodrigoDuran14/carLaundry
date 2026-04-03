import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api'; // Ajusta según tu backend

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token si es necesario
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Servicios por módulo
export const clientesApi = {
  getAll: () => api.get('/clientes'),
  getById: (id) => api.get(`/cliente/${id}`),
  find: (params) => api.get('/cliente', { params }),
  create: (data) => api.post('/cliente', data),
  update: (id, data) => api.put(`/cliente/${id}`, data),
  updateActive: (id) => api.patch(`/cliente/${id}`),
  addVehiculo: (data) => api.post('/clientesvehiculo', data),
};

export const empleadosApi = {
  getAll: () => api.get('/empleados'),
  getById: (id) => api.get(`/empleado/${id}`),
  find: (params) => api.get('/empleado', { params }),
  create: (data) => api.post('/empleado', data),
  update: (id, data) => api.put(`/empleados/${id}`, data),
  updateActive: (id) => api.patch(`/empleado/${id}`),
  updateAdmin: (id) => api.patch(`/empleadoadmin/${id}`),
  createPassword: (id, data) => api.put(`/empleadopassword/${id}`, data),
  login: (credentials) => api.post('/login', credentials),
  verifyToken: () => api.post('/verify-token'),
};

export const vehiculosApi = {
  getAll: () => api.get('/vehiculos'),
  getById: (id) => api.get(`/vehiculo/${id}`),
  find: (params) => api.get('/vehiculo', { params }),
  create: (data) => api.post('/vehiculo', data),
  update: (id, data) => api.put(`/vehiculo/${id}`, data),
  updateActive: (id) => api.patch(`/vehiculo/${id}`),
};

export const tiposLavadoApi = {
    getAll: () => api.get('/tiposLavados'),
  getById: (id) => api.get(`/tiposLavado/${id}`),
  find: (params) => api.get('/tiposLavado', { params }),
  create: (data) => api.post('/tiposLavado', data),
  update: (id, data) => api.put(`/tiposLavado/${id}`, data),
  updateActive: (id) => api.patch(`/tiposLavado/${id}`),
};

export const lavadosApi = {
    getAll: () => api.get('/lavados'),
  getById: (id) => api.get(`/lavados/${id}`),
  find: (params) => api.get('/lavado', { params }),
  findByDate: (params) => api.get('/lavadosDate', { params }),
  create: (data) => api.post('/lavado', data), 
  update: (id, data) => api.put(`/lavados/${id}`, data),
  iniciar: (id) => api.post(`/lavado/${id}/inicio`, {}),
  finalizar: (id) => api.patch(`/lavado/${id}/fin`),
  updateActive: (id) => api.patch(`/lavados/${id}`),
  notificar: (id) => api.get(`/notificar/${id}`),
};

export default api;