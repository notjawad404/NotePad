// userSlice.js

import { createSlice } from '@reduxjs/toolkit';
import { Tasks } from './components/Data';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    tasks: Tasks, // Assuming Tasks is an array of tasks
  },
  reducers: {
    // Define your reducers here if needed
  },
});

export default userSlice;
