import { createSlice } from "@reduxjs/toolkit";

const selectedStationsAndDateSlice = createSlice({
  name: "selectedStationsAndDate",
  initialState: {
    selectedsource: null,
    selecteddestination: null,
    journeyDate: new Date().toISOString(),
  },
  reducers: {
    addSource: (state, action) => {
      console.log("calling:" + action.payload);
      state.selectedsource = action.payload;
    },
    addDestination: (state, action) => {
      state.selecteddestination = action.payload;
    },
    addJourneyDate: (state, action) => {
      state.journeyDate =
        action.payload instanceof Date
          ? action.payload.toISOString()
          : action.payload;
    },
    removeSource: (state, action) => {
      state.selectedsource = null;
    },
    removeDestination: (state, action) => {
      state.selecteddestination = null;
    },
    removeJourneyDate: (state, action) => {
      state.journeyDate = null;
    },
  },
});
export const {
  addDestination,
  addJourneyDate,
  addSource,
  removeDestination,
  removeJourneyDate,
  removeSource,
} = selectedStationsAndDateSlice.actions;
export default selectedStationsAndDateSlice.reducer;
