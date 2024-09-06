import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Kullanıcı kayıt işlemi
export const registerUser = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
    try {
        const response = await axios.post('http://localhost:3001/register', userData);
        return response.data;
    } catch (error) {
        // Hata mesajını çıkartmak için uygun formatı kullanın
        return rejectWithValue(error.response?.data || { message: 'An unknown error occurred' });
    }
});

// Kullanıcı giriş işlemi
export const loginUser = createAsyncThunk('auth/login', async (userData, { rejectWithValue }) => {
    try {
        const response = await axios.post('http://localhost:3001/login', userData);
        return response.data;
    } catch (error) {
        // Hata mesajını çıkartmak için uygun formatı kullanın
        return rejectWithValue(error.response?.data || { message: 'An unknown error occurred' });
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        token: null,
        loading: false,
        error: null,
    },
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            localStorage.removeItem('token');
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                localStorage.setItem('token', action.payload.token); // JWT token'ı localStorage'da sakla
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
