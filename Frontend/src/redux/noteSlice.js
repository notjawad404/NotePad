import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance";

const initialState = {
  notes: [],
  selectedNote: null, // For storing a single selected note when viewing by ID
  status: "idle",
  error: null,
};

// Fetch all notes for the logged-in user
export const fetchNotes = createAsyncThunk("notes/fetchNotes", async () => {
  const response = await axiosInstance.get("/notes");
  return response.data;
});

// Fetch a single note by ID
export const fetchNoteById = createAsyncThunk("notes/fetchNoteById", async (id) => {
  const response = await axiosInstance.get(`/notes/${id}`);
  return response.data;
});

// Add a new note
export const addNote = createAsyncThunk("notes/addNote", async (noteData, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post("/notes", noteData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data || "Failed to add note.");
  }
});

// Delete a note
export const deleteNote = createAsyncThunk("notes/deleteNote", async (id) => {
  await axiosInstance.delete(`/notes/${id}`);
  return id;
});

// Update a note
export const updateNote = createAsyncThunk(
  "notes/updateNote",
  async ({ id, data }) => {
    const response = await axiosInstance.put(`/notes/${id}`, data);
    return response.data;
  }
);

const noteSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all notes
      .addCase(fetchNotes.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchNotes.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.notes = action.payload;
      })
      .addCase(fetchNotes.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      
      // Fetch note by ID
      .addCase(fetchNoteById.fulfilled, (state, action) => {
        state.selectedNote = action.payload;
      })

      // Add a note
      .addCase(addNote.pending, (state) => {
        state.status = "loading";
        state.successMessage = null;
        state.error = null;
      })
      .addCase(addNote.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.notes.push(action.payload);
        state.successMessage = "Note added successfully!";
      })
      .addCase(addNote.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to add note.";
      })
      // Delete note
      .addCase(deleteNote.fulfilled, (state, action) => {
        state.notes = state.notes.filter((note) => note._id !== action.payload);
      })
      
      // Update note
      .addCase(updateNote.fulfilled, (state, action) => {
        const index = state.notes.findIndex((note) => note._id === action.payload._id);
        if (index !== -1) {
          state.notes[index] = action.payload; // Update the note in the notes list
        }
        // Also update the selectedNote if it's being edited
        if (state.selectedNote && state.selectedNote._id === action.payload._id) {
          state.selectedNote = action.payload;
        }
      });
  },
});

export default noteSlice.reducer;
