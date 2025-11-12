// src/features/counter/counterSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    userInfo:{}
};

export const userInfoSlice = createSlice({
  name: 'userInfo', 
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
        console.log("user payload => ",action.payload)
      state.userInfo = action.payload; 
    },
  },
});

// Action creators are generated for each case reducer function
export const { setUserInfo } = userInfoSlice.actions;

// Export the reducer function itself
export default userInfoSlice.reducer;