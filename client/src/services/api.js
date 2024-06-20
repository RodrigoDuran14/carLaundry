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