import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    notes: [],
    status: "idle",
    error: null,
};

export const fetchNotes = createAsyncThunk("notes/fetchNotes", async () => {
    const response = await axios.get("http://localhost:5000/notes");
    return response.data.filter((note) => note.username === "user123");
});

export const deleteNote = createAsyncThunk('notes/deleteNote', async (id) => {
    await axios.delete(`http://localhost:5000/notes/${id}`);
    return id;
});

export const updateNote = createAsyncThunk('notes/updateNote', async ({ id, data }) => {
    const response = await axios.put(`http://localhost:5000/notes/${id}`, data);
    return response.data;
});

const noteSlice = createSlice({
    name: "notes",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
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
            .addCase(deleteNote.fulfilled, (state, action) => {
                state.notes = state.notes.filter((note) => note._id !== action.payload);
            })
            .addCase(updateNote.fulfilled, (state, action) => {
                const index = state.notes.findIndex(note => note._id === action.payload._id);
                if (index !== -1) {
                    state.notes[index] = action.payload;
                }
            });
    },
});


export default noteSlice.reducer;