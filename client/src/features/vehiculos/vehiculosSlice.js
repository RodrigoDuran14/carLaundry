import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { vehiculosApi } from '../../services/api';
import toast from 'react-hot-toast';

// Fetch all vehiculos
export const fetchVehiculos = createAsyncThunk(
  'vehiculos/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await vehiculosApi.getAll();
      return response.data;
    } catch (error) {
      toast.error('Error al cargar vehículos');
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Fetch vehiculo by id
export const fetchVehiculoById = createAsyncThunk(
  'vehiculos/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await vehiculosApi.getById(id);
      return response.data;
    } catch (error) {
      toast.error('Error al cargar vehículo');
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Find vehiculos by filters (marca, modelo, matricula, color, tipo)
export const findVehiculos = createAsyncThunk(
  'vehiculos/find',
  async (params, { rejectWithValue }) => {
    try {
      const response = await vehiculosApi.find(params);
      return response.data;
    } catch (error) {
      toast.error('Error al buscar vehículos');
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Create vehiculo
export const createVehiculo = createAsyncThunk(
  'vehiculos/create',
  async (vehiculoData, { rejectWithValue }) => {
    try {
      const response = await vehiculosApi.create(vehiculoData);
      toast.success('Vehículo creado exitosamente');
      return response.data;
    } catch (error) {
      toast.error('Error al crear vehículo');
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Update vehiculo
export const updateVehiculo = createAsyncThunk(
  'vehiculos/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await vehiculosApi.update(id, data);
      toast.success('Vehículo actualizado exitosamente');
      return response.data;
    } catch (error) {
      toast.error('Error al actualizar vehículo');
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Toggle active vehiculo
export const toggleActiveVehiculo = createAsyncThunk(
  'vehiculos/toggleActive',
  async (id, { rejectWithValue }) => {
    try {
      const response = await vehiculosApi.updateActive(id);
      toast.success('Estado actualizado');
      return response.data;
    } catch (error) {
      toast.error('Error al actualizar estado');
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  items: [],
  selectedVehiculo: null,
  loading: false,
  error: null,
  filters: {
    marca: '',
    modelo: '',
    matricula: '',
    color: '',
    tipo: '',
  },
  searchType: 'matricula',
};

const vehiculosSlice = createSlice({
  name: 'vehiculos',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setSearchType: (state, action) => {
      state.searchType = action.payload;
      state.filters = { marca: '', modelo: '', matricula: '', color: '', tipo: '' };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    clearSelected: (state) => {
      state.selectedVehiculo = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchVehiculos.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchVehiculos.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchVehiculos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch by id
      .addCase(fetchVehiculoById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchVehiculoById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedVehiculo = action.payload;
      })
      .addCase(fetchVehiculoById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Find
      .addCase(findVehiculos.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      // Create
      .addCase(createVehiculo.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      // Update
      .addCase(updateVehiculo.fulfilled, (state, action) => {
        const index = state.items.findIndex(v => v._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.selectedVehiculo?._id === action.payload._id) {
          state.selectedVehiculo = action.payload;
        }
      })
      // Toggle active
      .addCase(toggleActiveVehiculo.fulfilled, (state, action) => {
        const index = state.items.findIndex(v => v._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      });
  },
});

export const { setFilters,setSearchType, clearFilters, clearSelected } = vehiculosSlice.actions;
export default vehiculosSlice.reducer;