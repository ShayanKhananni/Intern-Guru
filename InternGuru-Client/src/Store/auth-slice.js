import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    signOut: (state) => {
      state.user = null;
    },
    updateUser: (state,action) =>
    {
      state.user = {...state.user,...action.payload};
    }
  },
});

export const authActions = authSlice.actions;
export default authSlice.reducer;