import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { empleadosApi } from '../../services/api';
import toast from 'react-hot-toast';

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      console.log('Enviando credenciales:', credentials); // Debug
      const response = await empleadosApi.login(credentials);
      console.log('Respuesta del servidor:', response.data); // Debug
      
      const { token, empleado } = response.data;
      
      // Guardar en localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(empleado));
      
      toast.success(`Bienvenido ${empleado.nombre}!`);
      return { token, user: empleado };
    } catch (error) {
      console.error('Error en login:', error.response?.data || error.message); // Debug
      
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          'Credenciales incorrectas';
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  toast.success('Sesión cerrada');
  return null;
});

export const verifyToken = createAsyncThunk(
  'auth/verifyToken',
  async (_, { rejectWithValue }) => {
    try {
      const response = await empleadosApi.verifyToken();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;