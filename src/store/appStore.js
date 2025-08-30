import { configureStore } from "@reduxjs/toolkit";
import stationsListReducer from "./slices/stationsListSlice";

const appStore = configureStore({
  reducer: {
    stationsList: stationsListReducer,
  },
});
export default appStore;
