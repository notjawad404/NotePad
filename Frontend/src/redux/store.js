import {configureStore} from '@reduxjs/toolkit';
import notesReducer from './noteSlice';
import flashcardsReducer from './flashCardSlice';
import authReducer from './authSlice';
import groupsReducer from './groupSlice';

const store = configureStore({
    reducer: {
        notes: notesReducer,
        flashcards: flashcardsReducer,
        auth: authReducer,
        groups: groupsReducer,
      },
});

export default store;