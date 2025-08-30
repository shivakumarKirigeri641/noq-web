import { configureStore } from "@reduxjs/toolkit";
import stationsListReducer from "./slices/stationsListSlice";
import loginReducer from "./slices/loginSlice";
import selectedStationsAndDateReducer from "./slices/selectedStationsAndDateSlice";

const appStore = configureStore({
  reducer: {
    stationsList: stationsListReducer,
    login: loginReducer,
    selectedStationsAndDate: selectedStationsAndDateReducer,
  },
});
export default appStore;
