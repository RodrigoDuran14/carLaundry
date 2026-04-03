import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { tiposLavadoApi } from '../../services/api';
import toast from 'react-hot-toast';

// Fetch all tipos de lavado
export const fetchTiposLavado = createAsyncThunk(
  'tiposLavado/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await tiposLavadoApi.getAll();
      return response.data;
    } catch (error) {
      toast.error('Error al cargar tipos de lavado');
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Fetch tipo de lavado by id
export const fetchTipoLavadoById = createAsyncThunk(
  'tiposLavado/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await tiposLavadoApi.getById(id);
      return response.data;
    } catch (error) {
      toast.error('Error al cargar tipo de lavado');
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Find tipos de lavado by filters
export const findTiposLavado = createAsyncThunk(
  'tiposLavado/find',
  async (params, { rejectWithValue }) => {
    try {
      const response = await tiposLavadoApi.find(params);
      return response.data;
    } catch (error) {
      toast.error('Error al buscar tipos de lavado');
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Create tipo de lavado
export const createTipoLavado = createAsyncThunk(
  'tiposLavado/create',
  async (tipoData, { rejectWithValue }) => {
    try {
      const dataToSend = {
        titulo: tipoData.titulo,
        descripcion: tipoData.descripcion,
        precio: tipoData.precio,
        duracion: tipoData.duracion,
      };
      const response = await tiposLavadoApi.create(tipoData);
      toast.success('Tipo de lavado creado exitosamente');
      return response.data;
    } catch (error) {
      toast.error('Error al crear tipo de lavado');
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Update tipo de lavado
export const updateTipoLavado = createAsyncThunk(
  'tiposLavado/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      if (!id) throw new Error('ID de tipo de lavado no proporcionado');
      const dataToSend = {
        titulo: data.titulo,
        descripcion: data.descripcion,
        precio: data.precio,
        duracion: data.duracion,
      };
      const response = await tiposLavadoApi.update(id, data);
      toast.success('Tipo de lavado actualizado exitosamente');
      return response.data;
    } catch (error) {
      toast.error('Error al actualizar tipo de lavado');
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Toggle active tipo de lavado
export const toggleActiveTipoLavado = createAsyncThunk(
  'tiposLavado/toggleActive',
  async (id, { rejectWithValue }) => {
    try {
      if (!id) throw new Error('ID de tipo de lavado no proporcionado');
      const response = await tiposLavadoApi.updateActive(id);
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
  selectedTipo: null,
  loading: false,
  error: null,
  filters: {
    titulo: '',
    descripcion: '',
  },
  searchType: 'titulo',
};

const tiposLavadoSlice = createSlice({
  name: 'tiposLavado',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setSearchType: (state, action) => {
      state.searchType = action.payload;
      state.filters = { titulo: '', descripcion: '' };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    clearSelected: (state) => {
      state.selectedTipo = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchTiposLavado.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTiposLavado.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.map(item => ({
          ...item,
          _id: item._id,
          titulo: item.titulo,
        }));
      })
      .addCase(fetchTiposLavado.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch by id
      .addCase(fetchTipoLavadoById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTipoLavadoById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedTipo = action.payload;
      })
      .addCase(fetchTipoLavadoById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Find
      .addCase(findTiposLavado.fulfilled, (state, action) => {
        state.items = action.payload.map(item => ({
          ...item,
          _id: item._id,
          titulo: item.titulo,
        }));
      })
      // Create
      .addCase(createTipoLavado.fulfilled, (state, action) => {
        const newItem = { ...action.payload, _id: action.payload._id, titulo: action.payload.titulo };
        state.items.unshift(newItem);
      })
      // Update
      .addCase(updateTipoLavado.fulfilled, (state, action) => {
        const updatedItem = { ...action.payload, _id: action.payload._id, titulo: action.payload.titulo };
        const index = state.items.findIndex(t => t._id === updatedItem._id);
        if (index !== -1) state.items[index] = updatedItem;
        if (state.selectedTipo?._id === updatedItem._id) {
          state.selectedTipo = updatedItem;
        }
      })
      // Toggle active
      .addCase(toggleActiveTipoLavado.fulfilled, (state, action) => {
        const updatedItem = { ...action.payload, _id: action.payload._id, titulo: action.payload.titulo };
        const index = state.items.findIndex(t => t._id === updatedItem._id);
        if (index !== -1) state.items[index] = updatedItem;
      });
  },
});

export const { setFilters,setSearchType, clearFilters, clearSelected } = tiposLavadoSlice.actions;
export default tiposLavadoSlice.reducer;