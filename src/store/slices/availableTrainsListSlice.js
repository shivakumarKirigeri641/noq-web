import { createSlice } from "@reduxjs/toolkit";

const availableTrainsListSlice = createSlice({
  name: "availableTrainsList",
  initialState: null,
  reducers: {
    addavailableTrainsList: (state, action) => {
      return action.payload;
    },
    removeavailableTrainsList: (state, action) => {
      return null;
    },
  },
});
export const { addavailableTrainsList, removeavailableTrainsList } =
  availableTrainsListSlice.actions;
export default availableTrainsListSlice.reducer;
