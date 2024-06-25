import axios from "axios"

const API_URL = "http://localhost:3001/api"


//=====================CLIENTES===========================

export const getClientList = ()=> axios.get(`${API_URL}/clientes`)
export const getClientById = (id)=> axios.get(`${API_URL}/cliente/${id}`)
export const getClientsByName = (query)=> axios.get(`${API_URL}/cliente`, {params: query})
export const getClientsByVehiculo = (query)=> axios.get(`${API_URL}/clientevehiculo`, {params: query})
export const postClient = (cliente)=> axios.post(`${API_URL}/cliente`, cliente)
export const updateClient = (id,cliente)=> axios.put(`${API_URL}/cliente/${id}`, cliente)
export const updateActiveClient = (id)=> axios.patch(`${API_URL}/cliente/${id}`)

//=====================VEHICULOS===========================

export const getVehiculoList = ()=> axios.get(`${API_URL}/vehiculos`)
export const findVehiculo = (query)=> axios.get(`${API_URL}/vehiculo`, {params: query})
export const getVehiculoById = (id)=> axios.get(`${API_URL}/vehiculo/${id}`)
export const postVehiculo = (vehiculo)=> axios.post(`${API_URL}/vehiculo`, vehiculo)
export const updateVehiculo = (id,vehiculo)=> axios.put(`${API_URL}/vehiculo/${id}`, vehiculo)
export const updateActiveVehiculo = (id)=> axios.patch(`${API_URL}/vehiculo/${id}`)

//=====================TIPOS DE LAVADOS===========================

export const getTiposLavadoList = ()=> axios.get(`${API_URL}/tiposLavados`)
export const getTiposLavadoById = (id)=> axios.get(`${API_URL}/tiposLavado/${id}`)
export const findTiposLavado = (query)=> axios.get(`${API_URL}/tiposLavado`, {params: query})
export const postTipoLavado = (tipoLavado)=> axios.post(`${API_URL}/tiposLavado`, tipoLavado)
export const updateTiposLavado = (id, tipoLavado)=> axios.put(`${API_URL}/tiposLavado/${id}`, tipoLavado)
export const updateActiveTiposLavado = (id)=> axios.patch(`${API_URL}/tiposLavado/${id}`)

//=====================EMPLEADOS==============================

export const getEmpleadoList = ()=> axios.get(`${API_URL}/empleados`)
export const getEmpleadoById = (id)=> axios.get(`${API_URL}/empleado/${id}`)
export const findEmpleado = (query)=> axios.get(`${API_URL}/empleado`, {params: query})
export const updateEmpleado = (id, empleado)=> axios.put(`${API_URL}/empleados/${id}`, empleado)
export const createPassword = (id, password)=> axios.put(`${API_URL}/empleadopassword/${id}`, password)
export const postEmpleado = (empleado)=> axios.post(`${API_URL}/empleado`, empleado)
export const updateActiveEmpleado = (id)=> axios.patch(`${API_URL}/empleado/${id}`)
export const updateAdminEmpleado = (id)=> axios.patch(`${API_URL}/empleadoadmin/${id}`)
export const login = (data)=> axios.post(`${API_URL}/login`, data)

//=====================LAVADOS==============================

export const postLavados = (lavado)=> axios.post(`${API_URL}/lavado`, lavado)
export const getLavadoList = ()=> axios.get(`${API_URL}/lavados`)
export const findLavado = (query)=> axios.get(`${API_URL}/lavado`, {params: query})
export const findLavadoByDate = (fecha)=> axios.get(`${API_URL}/lavadosDate`, {params: fecha})
export const getLavadoById = (id)=> axios.get(`${API_URL}/lavados/${id}`)
export const updateLavado = (id, lavado)=> axios.put(`${API_URL}/lavados/${id}`, lavado)
export const inicioLavado = (id, lavadores)=> axios.post(`${API_URL}/lavado/${id}/inicio`, lavadores)
export const finalizarLavado = (id)=> axios.patch(`${API_URL}/lavado/${id}/fin`)
export const updateActiveLavado = (id)=> axios.patch(`${API_URL}/lavados/${id}`)
export const notificar = (id)=> axios.get(`${API_URL}/notificar/${id}`)

