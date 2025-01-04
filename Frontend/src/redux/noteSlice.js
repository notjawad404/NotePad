import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  notes: [],
  selectedNote: null, // For storing a single selected note when viewing by ID
  status: "idle",
  error: null,
};

// Fetch all notes
export const fetchNotes = createAsyncThunk("notes/fetchNotes", async () => {
  const response = await axios.get("http://localhost:5000/notes");
  return response.data.filter((note) => note.username === "user123");
});

// Fetch a single note by ID
export const fetchNoteById = createAsyncThunk("notes/fetchNoteById", async (id) => {
  const response = await axios.get(`http://localhost:5000/notes/${id}`);
  return response.data;
});

// Delete a note
export const deleteNote = createAsyncThunk("notes/deleteNote", async (id) => {
  await axios.delete(`http://localhost:5000/notes/${id}`);
  return id;
});

// Update a note
export const updateNote = createAsyncThunk(
  "notes/updateNote",
  async ({ id, data }) => {
    const response = await axios.put(`http://localhost:5000/notes/${id}`, data);
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
