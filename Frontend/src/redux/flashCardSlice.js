import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    flashcards: [],
    status: "idle",
    error: null,
    successMessage: null,
};

export const fetchFlashCards = createAsyncThunk(
    "flashcards/fetchFlashCards",
    async (_, {rejectWithValue}) => {
        try{
            const response = await axios.get("https://note-pad-beryl.vercel.app/flashcards");
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data || "Failed to fetch flashcards.");
        }
    }
);

export const deleteFlashCard = createAsyncThunk(
    "flashcards/deleteFlashCard",
    async (id, {rejectWithValue}) => {
        try {
            await axios.delete(`https://note-pad-beryl.vercel.app/flashcards/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response.data || "Failed to delete flashcard.");
        }

    }
);

const flashCardSlice = createSlice({
    name: "flashcards",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchFlashCards.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchFlashCards.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.flashcards = action.payload;
            })
            .addCase(fetchFlashCards.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            })
            .addCase(deleteFlashCard.fulfilled, (state, action) => {
                state.flashcards = state.flashcards.filter(card => card.id !== action.payload);
                state.successMessage = "Flashcard deleted successfully.";
            })
            .addCase(deleteFlashCard.pending, (state) => {
                state.status = "loading";
            })
            .addCase(deleteFlashCard.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            });
    }
});export default flashCardSlice.reducer;