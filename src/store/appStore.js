import { configureStore } from "@reduxjs/toolkit";
import stationsListReducer from "./slices/stationsListSlice";
import loginReducer from "./slices/loginSlice";

const appStore = configureStore({
  reducer: {
    stationsList: stationsListReducer,
    login: loginReducer,
  },
});
export default appStore;
