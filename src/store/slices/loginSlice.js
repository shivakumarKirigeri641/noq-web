import { createSlice } from "@reduxjs/toolkit";

const loginSlice = createSlice({
  name: "login",
  initialState: null,
  reducers: {
    addlogin: (state, action) => {
      return action.payload;
    },
    removelogin: (state, action) => {
      return null;
    },
  },
});
export const { addlogin, removelogin } = loginSlice.actions;
export default loginSlice.reducer;
