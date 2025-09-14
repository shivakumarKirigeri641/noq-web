import { configureStore } from "@reduxjs/toolkit";
import stationsListReducer from "./slices/stationsListSlice";
import loginReducer from "./slices/loginSlice";
import selectedStationsAndDateReducer from "./slices/selectedStationsAndDateSlice";
import availableTrainsListReducer from "./slices/availableTrainsListSlice";
import confirmedTicketDetailsReducer from "./slices/confirmedTicketDetailsSlice";
const appStore = configureStore({
  reducer: {
    stationsList: stationsListReducer,
    login: loginReducer,
    selectedStationsAndDate: selectedStationsAndDateReducer,
    availableTrainsList: availableTrainsListReducer,
    confirmedTicketDetails: confirmedTicketDetailsReducer,
  },
});
export default appStore;
