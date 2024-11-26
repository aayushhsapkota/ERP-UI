import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../API/AuthApi";
import jwt_decode from "jwt-decode";

export const login = createAsyncThunk(
  'auth/login',
  async (loginData, thunkAPI) => {
    try {
      const response = await api.LoginApi(loginData);
      return response.data;
      
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

// New logout action
export const logout = createAsyncThunk(
    'auth/logout',
    async (_, thunkAPI) => {
      try {
        // Add any logout related api call if necessary
        localStorage.removeItem('erp-token');
        return;
      } catch (error) {
        return thunkAPI.rejectWithValue({}, error);
      }
    }
  );

const token = localStorage.getItem('erp-token');
let isAuthorized = false;
let isAdmin = false;

if (token) {
  const decodedToken = jwt_decode(token);
  const currentTime = Date.now() / 1000; // Convert to seconds

  if (decodedToken.exp > currentTime) {
    isAuthorized = true;
    isAdmin = decodedToken.isAdmin;
  } else {
    localStorage.removeItem('erp-token');
  }
}

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthorized: isAuthorized,
    isAdmin: isAdmin,
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // add the token to the localStorage
        localStorage.setItem('erp-token', action.payload.token);
        // set isAuthorized and isAdmin from the response
        state.isAuthorized = true;
        state.isAdmin=jwt_decode(localStorage.getItem('erp-token')).isAdmin;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      .addCase(logout.fulfilled, (state) => {
        state.isAuthorized = false;
        state.isAdmin = false;
        state.status = 'idle';
      });
  }
});

export default authSlice.reducer;
