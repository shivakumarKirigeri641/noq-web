import { createSlice } from "@reduxjs/toolkit";

const stationsListSlice = createSlice({
  name: "stationsList",
  initialState: [],
  reducers: {
    addStationsList: (state, action) => {
      return action.payload;
    },
    removeStationsList: (state, action) => {
      return (state.length = 0);
    },
  },
});
export const { addStationsList, removeStationsList } =
  stationsListSlice.actions;
export default stationsListSlice.reducer;
