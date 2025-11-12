
import { configureStore } from '@reduxjs/toolkit';
// Import the reducer created in the next step
import paymentReducer from './slices/paymentInfo'; 
import userReducer from './slices/users'

export const store = configureStore({
  reducer: {
    // Define a top-level state field named 'counter'
    paymentInfo: paymentReducer,
    userInfo: userReducer
    // Add other slices here (e.g., user: userReducer, posts: postsReducer)
  },
});