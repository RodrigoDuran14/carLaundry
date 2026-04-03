import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { lavadosApi } from '../../services/api';
import toast from 'react-hot-toast';

// Fetch all lavados
export const fetchLavados = createAsyncThunk(
  'lavados/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await lavadosApi.getAll();
      return response.data;
    } catch (error) {
      toast.error('Error al cargar lavados');
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Fetch lavado by id
export const fetchLavadoById = createAsyncThunk(
  'lavados/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await lavadosApi.getById(id);
      return response.data;
    } catch (error) {
      toast.error('Error al cargar lavado');
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Find lavados by filters
export const findLavados = createAsyncThunk(
  'lavados/find',
  async (params, { rejectWithValue }) => {
    try {
      const response = await lavadosApi.find(params);
      return response.data;
    } catch (error) {
      toast.error('Error al buscar lavados');
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Find lavados by date
export const findLavadosByDate = createAsyncThunk(
  'lavados/findByDate',
  async (params, { rejectWithValue }) => {
    try {
      const response = await lavadosApi.findByDate(params);
      return response.data;
    } catch (error) {
      toast.error('Error al buscar lavados por fecha');
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Create lavado
export const createLavado = createAsyncThunk(
  'lavados/create',
  async (lavadoData, { rejectWithValue }) => {
    try {
      const response = await lavadosApi.create(lavadoData);
      toast.success(lavadoData.iniciarAhora ? 'Lavado creado e iniciado exitosamente' : 'Lavado registrado exitosamente');
      return response.data;
    } catch (error) {
      toast.error('Error al registrar lavado');
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Update lavado
export const updateLavado = createAsyncThunk(
  'lavados/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      if (!id) throw new Error('ID de lavado no proporcionado');
      const response = await lavadosApi.update(id, data);
      toast.success('Lavado actualizado exitosamente');
      return response.data;
    } catch (error) {
      toast.error(error.message || 'Error al actualizar lavado');
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Iniciar lavado
export const iniciarLavado = createAsyncThunk(
  'lavados/iniciar',
  async (id, { rejectWithValue }) => {
    try {
      if (!id) throw new Error('ID de lavado no proporcionado');
      const response = await lavadosApi.iniciar(id);
      toast.success('Lavado iniciado');
      return response.data;
    } catch (error) {
      toast.error('Error al iniciar lavado');
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Finalizar lavado
export const finalizarLavado = createAsyncThunk(
  'lavados/finalizar',
  async (id, { rejectWithValue }) => {
    try {
      if (!id) throw new Error('ID de lavado no proporcionado');
      const response = await lavadosApi.finalizar(id);
      toast.success('Lavado finalizado');
      return response.data;
    } catch (error) {
      toast.error('Error al finalizar lavado');
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Toggle active lavado
export const toggleActiveLavado = createAsyncThunk(
  'lavados/toggleActive',
  async (id, { rejectWithValue }) => {
    try {
      if (!id) throw new Error('ID de lavado no proporcionado');
      const response = await lavadosApi.updateActive(id);
      toast.success('Estado actualizado');
      return response.data;
    } catch (error) {
      toast.error('Error al actualizar estado');
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Notificar lavado
export const notificarLavado = createAsyncThunk(
  'lavados/notificar',
  async (id, { rejectWithValue }) => {
    try {
      const response = await lavadosApi.notificar(id);
      toast.success('Notificación enviada');
      return response.data;
    } catch (error) {
      toast.error('Error al enviar notificación');
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  items: [],
  filteredItems: [],
  selectedLavado: null,
  loading: false,
  error: null,
  filters: {
    cliente: '',
    vehiculo: '',
    tipoLavado: '',
    empleado: '',
    estado: 'todos',
    searchTerm: '',
    fechaInicio: '',
    fechaFin: '',
  },
};

// Función de filtrado completa con todos los criterios
const filterLavados = (items, filters) => {
  if (!items) return [];
  
  return items.filter((lavado) => {
    // Filtro por búsqueda (cliente o matrícula)
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      const matchesSearch = 
        lavado.clienteId?.nombre?.toLowerCase().includes(searchLower) ||
        lavado.vehiculoId?.matricula?.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }
    
    // Filtro por estado - Usando estadoDelLavado del backend
    if (filters.estado !== 'todos') {
      let estadoBackend = '';
      switch (filters.estado) {
        case 'pendiente':
          estadoBackend = 'Pendiente';
          break;
        case 'en-proceso':
          estadoBackend = 'En progreso';
          break;
        case 'completado':
          estadoBackend = 'Terminado';
          break;
        default:
          estadoBackend = '';
      }
      
      if (lavado.estadoDelLavado !== estadoBackend) return false;
    }
    
    // Filtro por cliente (por nombre o ID)
    if (filters.cliente) {
      const clienteMatch = 
        lavado.clienteId?.nombre?.toLowerCase().includes(filters.cliente.toLowerCase()) ||
        lavado.clienteId?._id === filters.cliente;
      if (!clienteMatch) return false;
    }
    
    // Filtro por vehículo (por matrícula o ID)
    if (filters.vehiculo) {
      const vehiculoMatch = 
        lavado.vehiculoId?.matricula?.toLowerCase().includes(filters.vehiculo.toLowerCase()) ||
        lavado.vehiculoId?._id === filters.vehiculo;
      if (!vehiculoMatch) return false;
    }
    
    // Filtro por tipo de lavado (busca en el array tipoLavado)
    if (filters.tipoLavado) {
      const tipoLavadoObj = lavado.tipoLavado?.[0];
      const tipoMatch = 
        tipoLavadoObj?.nombre?.toLowerCase().includes(filters.tipoLavado.toLowerCase()) ||
        tipoLavadoObj?.titulo?.toLowerCase().includes(filters.tipoLavado.toLowerCase()) ||
        tipoLavadoObj?._id === filters.tipoLavado;
      if (!tipoMatch) return false;
    }
    
    // Filtro por empleado (busca en el array lavador)
    if (filters.empleado) {
      const tieneEmpleado = lavado.lavador?.some(emp => 
        emp.nombre?.toLowerCase().includes(filters.empleado.toLowerCase()) ||
        emp._id === filters.empleado
      );
      if (!tieneEmpleado) return false;
    }
    
    // Filtro por fecha de inicio
    if (filters.fechaInicio) {
      const fechaLavado = new Date(lavado.createdAt || lavado.horarioInicio);
      const fechaFiltro = new Date(filters.fechaInicio);
      if (fechaLavado < fechaFiltro) return false;
    }
    
    // Filtro por fecha de fin
    if (filters.fechaFin) {
      const fechaLavado = new Date(lavado.createdAt || lavado.horarioInicio);
      const fechaFiltro = new Date(filters.fechaFin);
      if (fechaLavado > fechaFiltro) return false;
    }
    
    return true;
  });
};

const lavadosSlice = createSlice({
  name: 'lavados',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.filteredItems = filterLavados(state.items, state.filters);
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
      state.filteredItems = state.items;
    },
    clearSelected: (state) => {
      state.selectedLavado = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLavados.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLavados.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.filteredItems = filterLavados(action.payload, state.filters);
      })
      .addCase(fetchLavados.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchLavadoById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLavadoById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedLavado = action.payload;
      })
      .addCase(fetchLavadoById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(findLavados.fulfilled, (state, action) => {
        state.items = action.payload;
        state.filteredItems = filterLavados(action.payload, state.filters);
      })
      .addCase(findLavadosByDate.fulfilled, (state, action) => {
        state.items = action.payload;
        state.filteredItems = filterLavados(action.payload, state.filters);
      })
      .addCase(createLavado.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
        state.filteredItems = filterLavados(state.items, state.filters);
      })
      .addCase(updateLavado.fulfilled, (state, action) => {
        const index = state.items.findIndex(l => l._id === action.payload._id);
        if (index !== -1) state.items[index] = action.payload;
        if (state.selectedLavado?._id === action.payload._id) state.selectedLavado = action.payload;
        state.filteredItems = filterLavados(state.items, state.filters);
      })
      .addCase(iniciarLavado.fulfilled, (state, action) => {
        const index = state.items.findIndex(l => l._id === action.payload._id);
        if (index !== -1) state.items[index] = action.payload;
        if (state.selectedLavado?._id === action.payload._id) state.selectedLavado = action.payload;
        state.filteredItems = filterLavados(state.items, state.filters);
      })
      .addCase(finalizarLavado.fulfilled, (state, action) => {
        const index = state.items.findIndex(l => l._id === action.payload._id);
        if (index !== -1) state.items[index] = action.payload;
        if (state.selectedLavado?._id === action.payload._id) state.selectedLavado = action.payload;
        state.filteredItems = filterLavados(state.items, state.filters);
      })
      .addCase(toggleActiveLavado.fulfilled, (state, action) => {
        const index = state.items.findIndex(l => l._id === action.payload._id);
        if (index !== -1) state.items[index] = action.payload;
        state.filteredItems = filterLavados(state.items, state.filters);
      });
  },
});

export const { setFilters, clearFilters, clearSelected } = lavadosSlice.actions;
export default lavadosSlice.reducer;