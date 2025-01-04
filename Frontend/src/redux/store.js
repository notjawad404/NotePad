import {configureStore} from '@reduxjs/toolkit';
import notesReducer from './noteSlice';

const store = configureStore({
    reducer: {
        notes: notesReducer,
      },
});

export default store;