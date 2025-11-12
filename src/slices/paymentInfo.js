// src/features/counter/counterSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    paymentInfo:{}
};

export const paymentInfoSlice = createSlice({
  name: 'paymentInfo', 
  initialState,
  reducers: {
    setPaymentInfo: (state, action) => {
        console.log("payload => ",action.payload)
      state.paymentInfo = action.payload; 
    },
  },
});

// Action creators are generated for each case reducer function
export const { setPaymentInfo } = paymentInfoSlice.actions;

// Export the reducer function itself
export default paymentInfoSlice.reducer;