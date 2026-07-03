import {configureStore} from '@reduxjs/toolkit';
import notesReducer from './noteSlice';
import flashcardsReducer from './flashCardSlice';
import authReducer from './authSlice';

const store = configureStore({
    reducer: {
        notes: notesReducer,
        flashcards: flashcardsReducer,
        auth: authReducer,
      },
});

export default store;