import {configureStore} from '@reduxjs/toolkit';
import notesReducer from './noteSlice';
import flashcardsReducer from './flashCardSlice';

const store = configureStore({
    reducer: {
        notes: notesReducer,
        flashcards: flashcardsReducer,
      },
});

export default store;