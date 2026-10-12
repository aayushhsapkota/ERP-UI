import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../API/AuthApi";
import { refreshAccessToken } from "../API/index";
import jwt_decode from "jwt-decode";
import { setAccessToken, clearAccessToken } from "../API/tokenStore";

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

// Called once on app load. Exchanges the httpOnly refresh cookie (if any)
// for a fresh access token, so a page reload doesn't force a re-login.
// There's no token in localStorage to check anymore - the only way to know
// whether a session exists is to ask the server.
//
// Goes through the SAME shared refreshAccessToken() the axios interceptor
// uses (not AuthApi.RefreshApi, which would fire its own independent
// request) - refresh tokens are single-use, so under StrictMode's
// double-invoked effects two uncoordinated calls here would race each
// other and one would spuriously 401 even though the other succeeded.
export const bootstrapAuth = createAsyncThunk(
  'auth/bootstrap',
  async (_, thunkAPI) => {
    try {
      const token = await refreshAccessToken();
      return token;
    } catch (error) {
      return thunkAPI.rejectWithValue(null);
    }
  }
);

export const logout = createAsyncThunk(
    'auth/logout',
    async (_, thunkAPI) => {
      try {
        // Revokes the refresh token server-side so a stolen/old cookie can't
        // be used to get a new access token after this. Still clears local
        // state in `finally` even if this call fails (e.g. offline) - the
        // user asked to log out, the tab should reflect that regardless.
        await api.LogoutApi();
      } catch (error) {
        return thunkAPI.rejectWithValue(error);
      } finally {
        clearAccessToken();
      }
    }
  );

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthorized: false,
    isAdmin: false,
    // True until the initial bootstrapAuth() call resolves. App.jsx uses
    // this to hold off rendering the login page while that's in flight, so
    // an already-logged-in user doesn't see a flash of the login screen on
    // every reload.
    initializing: true,
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
        setAccessToken(action.payload.token);
        state.isAuthorized = true;
        state.isAdmin = jwt_decode(action.payload.token).isAdmin;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      .addCase(bootstrapAuth.fulfilled, (state, action) => {
        // refreshAccessToken() already called setAccessToken() internally;
        state.isAuthorized = true;
        state.isAdmin = jwt_decode(action.payload).isAdmin;
        state.initializing = false;
      })
      .addCase(bootstrapAuth.rejected, (state) => {
        // No valid refresh cookie - not an error, just means nobody's
        // logged in on this browser right now.
        state.isAuthorized = false;
        state.isAdmin = false;
        state.initializing = false;
      })

      .addCase(logout.fulfilled, (state) => {
        state.isAuthorized = false;
        state.isAdmin = false;
        state.status = 'idle';
      })
      .addCase(logout.rejected, (state) => {
        // Even if LogoutApi fails (e.g., due to being offline), the thunk's `finally`
        // has already cleared tokenStore, so update the local state accordingly.
        state.isAuthorized = false;
        state.isAdmin = false;
        state.status = 'idle';
      });
  }
});

export default authSlice.reducer;
