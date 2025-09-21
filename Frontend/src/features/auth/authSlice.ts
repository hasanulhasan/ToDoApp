import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

type LoginPayload = { email: string; password: string };

export const loginUser = createAsyncThunk(
  "auth/login",
  async (payload: LoginPayload, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) return rejectWithValue(await res.json());
      const data = await res.json();
      // Expected response: { token: string, user: {...}, expiresInSeconds?: number }
      return data;
    } catch (err) {
      return rejectWithValue({ message: "Network error" });
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (
    payload: { name: string; email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await fetch(`${API}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) return rejectWithValue(await res.json());
      const data = await res.json();
      return data;
    } catch (err) {
      return rejectWithValue({ message: "Network error" });
    }
  }
);

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: { id: string; name: string; email: string } | null;
  expiresAt: number | null;
  status: "idle" | "loading" | "error";
  error: string | null;
}


function loadAuthFromStorage(): AuthState {
  const raw = localStorage.getItem("auth");
  if (!raw) return {
    accessToken: null,
    refreshToken: null,
    user: null,
    expiresAt: null,
    status: "idle",
    error: null,
  };

  try {
    const saved = JSON.parse(raw);
    return {
      accessToken: saved.accessToken,
      refreshToken: saved.refreshToken,
      user: saved.user,
      expiresAt: saved.expiresAt,
      status: "idle",
      error: null,
    };
  } catch {
    localStorage.removeItem("auth");
    return {
      accessToken: null,
      refreshToken: null,
      user: null,
      expiresAt: null,
      status: "idle",
      error: null,
    };
  }
}

const initial: AuthState = loadAuthFromStorage();

const authSlice = createSlice({
  name: "auth",
  initialState: initial,
  reducers: {
    logout(state) {
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
      state.expiresAt = null;
      localStorage.removeItem("auth");
    },
    setTokenFromStorage(state, action) {
      const { accessToken, refreshToken, user, expiresAt } = action.payload;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.user = user;
      state.expiresAt = expiresAt;
    },
  },
  extraReducers: (builder) => {
    const saveAuth = (state: AuthState, payload: any) => {
      const expiresIn = payload.expiresInSeconds ?? 60 * 60; // default 1 hour
      state.accessToken = payload.accessToken;
      state.refreshToken = payload.refreshToken;
      state.user = payload.user ?? null;
      state.expiresAt = Date.now() + expiresIn * 1000;

      localStorage.setItem(
        "auth",
        JSON.stringify({
          accessToken: state.accessToken,
          refreshToken: state.refreshToken,
          user: state.user,
          expiresAt: state.expiresAt,
        })
      );
    };

    builder
      .addCase(loginUser.pending, (s) => {
        s.status = "loading";
        s.error = null;
      })
      .addCase(loginUser.fulfilled, (s, action) => {
        s.status = "idle";
        saveAuth(s, action.payload);
      })
      .addCase(loginUser.rejected, (s, action: any) => {
        s.status = "error";
        s.error = action.payload?.message || "Login failed";
      })

      .addCase(registerUser.pending, (s) => {
        s.status = "loading";
        s.error = null;
      })
      .addCase(registerUser.fulfilled, (s, action) => {
        s.status = "idle";
        saveAuth(s, action.payload);
      })
      .addCase(registerUser.rejected, (s, action: any) => {
        s.status = "error";
        s.error = action.payload?.message || "Register failed";
      });
  },
});


export const { logout, setTokenFromStorage } = authSlice.actions
export const selectAuth = (s: RootState) => s.auth
export default authSlice.reducer