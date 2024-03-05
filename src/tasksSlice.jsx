import { createSlice } from '@reduxjs/toolkit';
import { Tasks } from './components/Data';

export const tasksSlice = createSlice({
  name: 'user',
  initialState: {
    tasks: Tasks,
  },
  reducers: {
    // Define your reducers here if needed
  },
});

export default tasksSlice;
