// taskseducer.jsx

import { configureStore } from '@reduxjs/toolkit';
import { tasksSlice } from './tasksSlice'; // Assuming userSlice is defined in a separate file

// Combine all slices into rootReducer if you have multiple slices
const rootReducer = {
  tasks: tasksSlice.reducer,
  // Add other reducers here if you have more slices
};

const store = configureStore({
  reducer: rootReducer,
});

export default store;
