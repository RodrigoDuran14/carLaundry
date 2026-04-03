import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { clientesApi } from '../../services/api';
import toast from 'react-hot-toast';

// Fetch all clientes
export const fetchClientes = createAsyncThunk(
  'clientes/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await clientesApi.getAll();
      return response.data;
    } catch (error) {
      toast.error('Error al cargar clientes');
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Fetch cliente by id
export const fetchClienteById = createAsyncThunk(
  'clientes/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await clientesApi.getById(id);
      return response.data;
    } catch (error) {
      toast.error('Error al cargar cliente');
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Find clientes by filters
export const findClientes = createAsyncThunk(
  'clientes/find',
  async (params, { rejectWithValue }) => {
    try {
      const response = await clientesApi.find(params);
      return response.data;
    } catch (error) {
      toast.error('Error al buscar clientes');
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Find clientes by vehiculo
export const findClientesByVehiculo = createAsyncThunk(
  'clientes/findByVehiculo',
  async (params, { rejectWithValue }) => {
    try {
      const response = await clientesApi.findByVehiculo(params);
      return response.data;
    } catch (error) {
      toast.error('Error al buscar clientes por vehículo');
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Create cliente
export const createCliente = createAsyncThunk(
  'clientes/create',
  async (clienteData, { rejectWithValue }) => {
    try {
      const response = await clientesApi.create(clienteData);
      toast.success('Cliente creado exitosamente');
      return response.data;
    } catch (error) {
      toast.error('Error al crear cliente');
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Update cliente
export const updateCliente = createAsyncThunk(
  'clientes/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      if (!id) {
        throw new Error('ID de cliente no proporcionado');
      }
      const response = await clientesApi.update(id, data);
      toast.success('Cliente actualizado exitosamente');
      return response.data;
    } catch (error) {
      toast.error(error.message || 'Error al actualizar cliente');
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Toggle active cliente
export const toggleActiveCliente = createAsyncThunk(
  'clientes/toggleActive',
  async (id, { rejectWithValue }) => {
    try {
      if (!id) {
        throw new Error('ID de cliente no proporcionado');
      }
      const response = await clientesApi.updateActive(id);
      toast.success('Estado actualizado');
      return response.data;
    } catch (error) {
      toast.error('Error al actualizar estado');
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Add vehiculo to cliente
export const addVehiculoToCliente = createAsyncThunk(
  'clientes/addVehiculo',
  async (data, { rejectWithValue }) => {
    try {
      const response = await clientesApi.addVehiculo(data);
      toast.success('Vehículo agregado al cliente');
      return response.data;
    } catch (error) {
      toast.error('Error al agregar vehículo');
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  items: [],
  selectedCliente: null,
  loading: false,
  error: null,
  filters: {
    nombre: '',
    dni: '',
    celular: '',
    vehiculo:''
  },
};

const clientesSlice = createSlice({
  name: 'clientes',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setSearchType: (state, action) => {
      state.searchType = action.payload;
      state.filters = { nombre: '', dni: '', celular: '', vehiculo: '' };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    clearSelected: (state) => {
      state.selectedCliente = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchClientes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchClientes.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchClientes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch by id
      .addCase(fetchClienteById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchClienteById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCliente = action.payload;
      })
      .addCase(fetchClienteById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Find
      .addCase(findClientes.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      // Find by vehiculo
      .addCase(findClientesByVehiculo.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      // Create
      .addCase(createCliente.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      // Update
      .addCase(updateCliente.fulfilled, (state, action) => {
        const index = state.items.findIndex(c => c.id === action.payload.id || c._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.selectedCliente?.id === action.payload.id || state.selectedCliente?._id === action.payload._id) {
          state.selectedCliente = action.payload;
        }
      })
      // Toggle active
      .addCase(toggleActiveCliente.fulfilled, (state, action) => {
        const index = state.items.findIndex(c => c._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      // Add vehiculo
      .addCase(addVehiculoToCliente.fulfilled, (state, action) => {
        if (state.selectedCliente?.id === action.payload.id || state.selectedCliente?._id === action.payload._id) {
          state.selectedCliente = action.payload;
        }
      });
  },
});

export const { setFilters,setSearchType,clearFilters, clearSelected } = clientesSlice.actions;
export default clientesSlice.reducer;