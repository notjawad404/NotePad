import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance";

const initialState = {
  groups: [],
  status: "idle",
  error: null,
  successMessage: null,
};

// Fetch all groups for the logged-in user
export const fetchGroups = createAsyncThunk(
  "groups/fetchGroups",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/groups");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch groups.");
    }
  }
);

// Create a new group
export const addGroup = createAsyncThunk(
  "groups/addGroup",
  async (name, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/groups", { name });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to create group.");
    }
  }
);

// Rename a group
export const renameGroup = createAsyncThunk(
  "groups/renameGroup",
  async ({ id, name }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/groups/${id}`, { name });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to rename group.");
    }
  }
);

// Archive / unarchive a group
export const setGroupArchived = createAsyncThunk(
  "groups/setGroupArchived",
  async ({ id, archived }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`/groups/${id}/archive`, { archived });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update group.");
    }
  }
);

// Delete a group (its notes are unassigned on the backend)
export const deleteGroup = createAsyncThunk(
  "groups/deleteGroup",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/groups/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete group.");
    }
  }
);

const groupSlice = createSlice({
  name: "groups",
  initialState,
  reducers: {
    clearGroupMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch groups
      .addCase(fetchGroups.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchGroups.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.groups = action.payload;
      })
      .addCase(fetchGroups.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })

      // Add group (backend returns newest-first, so prepend)
      .addCase(addGroup.fulfilled, (state, action) => {
        state.groups.unshift(action.payload);
        state.successMessage = "Group created.";
        state.error = null;
      })
      .addCase(addGroup.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Rename group
      .addCase(renameGroup.fulfilled, (state, action) => {
        const index = state.groups.findIndex((g) => g._id === action.payload._id);
        if (index !== -1) state.groups[index] = action.payload;
        state.successMessage = "Group renamed.";
        state.error = null;
      })
      .addCase(renameGroup.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Archive / unarchive group
      .addCase(setGroupArchived.fulfilled, (state, action) => {
        const index = state.groups.findIndex((g) => g._id === action.payload._id);
        if (index !== -1) state.groups[index] = action.payload;
      })
      .addCase(setGroupArchived.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Delete group
      .addCase(deleteGroup.fulfilled, (state, action) => {
        state.groups = state.groups.filter((g) => g._id !== action.payload);
        state.successMessage = "Group deleted.";
        state.error = null;
      })
      .addCase(deleteGroup.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearGroupMessages } = groupSlice.actions;
export default groupSlice.reducer;
