import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userInfo: {},
};

const userInfoSlice = createSlice({
  name: 'userInfo',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.userInfo = action.payload;
    },
    clearUser:(state,action) =>{
      state.userInfo = {}
    }
  }
});

export const { setUser, clearUser } = userInfoSlice.actions;
export default userInfoSlice.reducer;
