import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { api } from "@/lib/api";

type User = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  is_active: boolean;
  is_verified: boolean;
};

type AuthState = {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
};

const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  loading: false,
  error: null,
};

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const data = await api.post<{ access_token: string; refresh_token: string }>(
        "/users/login",
        { email, password }
      );
      const user = await api.get<User>("/users/me", data.access_token);
      return { ...data, user };
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const refreshToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as any;
    try {
      const data = await api.post<{ access_token: string; refresh_token: string }>(
        "/users/refresh-token",
        { refresh_token: state.auth.refreshToken }
      );
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      localStorage.removeItem("zyro-token");
      localStorage.removeItem("zyro-refresh-token");
      localStorage.removeItem("zyro-user");
    },
    loadFromStorage(state) {
      const token = localStorage.getItem("zyro-token");
      const refreshToken = localStorage.getItem("zyro-refresh-token");
      const user = localStorage.getItem("zyro-user");
      if (token) state.token = token;
      if (refreshToken) state.refreshToken = refreshToken;
      if (user) state.user = JSON.parse(user);
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
        state.token = action.payload.access_token;
        state.refreshToken = action.payload.refresh_token;
        state.user = action.payload.user;
        localStorage.setItem("zyro-token", action.payload.access_token);
        localStorage.setItem("zyro-refresh-token", action.payload.refresh_token);
        localStorage.setItem("zyro-user", JSON.stringify(action.payload.user));
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.token = action.payload.access_token;
        state.refreshToken = action.payload.refresh_token;
        localStorage.setItem("zyro-token", action.payload.access_token);
        localStorage.setItem("zyro-refresh-token", action.payload.refresh_token);
      });
  },
});

export const { logout, loadFromStorage } = authSlice.actions;
export default authSlice.reducer;
