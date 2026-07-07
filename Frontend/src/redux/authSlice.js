import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance";

const storedUser = localStorage.getItem("user");

const initialState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  token: localStorage.getItem("token") || null,
  status: "idle",
  error: null,
};

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ username, email, password }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/auth/register", { username, email, password });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Registration failed.");
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/auth/login", { email, password });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed.");
    }
  }
);

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async ({ username, email }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put("/auth/me", { username, email });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update profile.");
    }
  }
);

export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async ({ currentPassword, newPassword }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put("/auth/password", { currentPassword, newPassword });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update password.");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(updateProfile.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
