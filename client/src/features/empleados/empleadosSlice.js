import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { empleadosApi } from '../../services/api';
import toast from 'react-hot-toast';

// Fetch all empleados
export const fetchEmpleados = createAsyncThunk(
  'empleados/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await empleadosApi.getAll();
      return response.data;
    } catch (error) {
      toast.error('Error al cargar empleados');
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Fetch empleado by id
export const fetchEmpleadoById = createAsyncThunk(
  'empleados/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await empleadosApi.getById(id);
      return response.data;
    } catch (error) {
      toast.error('Error al cargar empleado');
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Find empleados by filters
export const findEmpleados = createAsyncThunk(
  'empleados/find',
  async (params, { rejectWithValue }) => {
    try {
      const response = await empleadosApi.find(params);
      return response.data;
    } catch (error) {
      toast.error('Error al buscar empleados');
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Create empleado
export const createEmpleado = createAsyncThunk(
  'empleados/create',
  async (empleadoData, { rejectWithValue }) => {
    try {
      const response = await empleadosApi.create(empleadoData);
      toast.success('Empleado creado exitosamente');
      return response.data;
    } catch (error) {
      toast.error('Error al crear empleado');
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Update empleado
export const updateEmpleado = createAsyncThunk(
  'empleados/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      if (!id) {
        throw new Error('ID de empleado no proporcionado');
      }
      const response = await empleadosApi.update(id, data);
      toast.success('Empleado actualizado exitosamente');
      return response.data;
    } catch (error) {
      toast.error(error.message || 'Error al actualizar empleado');
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Toggle active empleado
export const toggleActiveEmpleado = createAsyncThunk(
  'empleados/toggleActive',
  async (id, { rejectWithValue }) => {
    try {
      if (!id) {
        throw new Error('ID de empleado no proporcionado');
      }
      const response = await empleadosApi.updateActive(id);
      toast.success('Estado actualizado');
      return response.data;
    } catch (error) {
      toast.error('Error al actualizar estado');
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Update admin status
export const updateAdminEmpleado = createAsyncThunk(
  'empleados/updateAdmin',
  async (id, { rejectWithValue }) => {
    try {
      if (!id) {
        throw new Error('ID de empleado no proporcionado');
      }
      
      const response = await empleadosApi.updateAdmin(id);
      toast.success('Estado de administrador actualizado');
      return response.data;
    } catch (error) {
      toast.error('Error al actualizar estado de administrador');
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Create password for empleado
export const createPassword = createAsyncThunk(
  'empleados/createPassword',
  async ({ id, password }, { rejectWithValue }) => {
    try {
      if (!id) {
        throw new Error('ID de empleado no proporcionado');
      }
      const response = await empleadosApi.createPassword(id, { password });
      toast.success('Contraseña creada exitosamente');
      return response.data;
    } catch (error) {
      toast.error('Error al crear contraseña');
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  items: [],
  selectedEmpleado: null,
  loading: false,
  error: null,
  filters: {
    nombre: '',
    dni: '',
    mail: '',
    celular: '',
  },
  searchType: 'nombre',
};

const empleadosSlice = createSlice({
  name: 'empleados',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setSearchType: (state, action) => {
      state.searchType = action.payload;
      state.filters = { nombre: '', dni: '', mail: '', celular: '' };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    clearSelected: (state) => {
      state.selectedEmpleado = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchEmpleados.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEmpleados.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchEmpleados.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch by id
      .addCase(fetchEmpleadoById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEmpleadoById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedEmpleado = action.payload;
      })
      .addCase(fetchEmpleadoById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Find
      .addCase(findEmpleados.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      // Create
      .addCase(createEmpleado.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      // Update
      .addCase(updateEmpleado.fulfilled, (state, action) => {
        const index = state.items.findIndex(e => e._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.selectedEmpleado?._id === action.payload._id) {
          state.selectedEmpleado = action.payload;
        }
      })
      // Toggle active
      .addCase(toggleActiveEmpleado.fulfilled, (state, action) => {
        const index = state.items.findIndex(e => e._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      // Update admin
      .addCase(updateAdminEmpleado.fulfilled, (state, action) => {
        const index = state.items.findIndex(e => e._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      });
  },
});

export const { setFilters, setSearchType, clearFilters, clearSelected } = empleadosSlice.actions;
export default empleadosSlice.reducer;