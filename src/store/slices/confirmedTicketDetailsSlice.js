import { createSlice } from "@reduxjs/toolkit";

const confirmedTicketDetailsSlice = createSlice({
  name: "confirmedTicketDetails",
  initialState: [],
  reducers: {
    addconfirmedTicketDetails: (state, action) => {
      return action.payload;
    },
    removeconfirmedTicketDetails: (state, action) => {
      return (state.length = 0);
    },
  },
});
export const { addconfirmedTicketDetails, removeconfirmedTicketDetails } =
  confirmedTicketDetailsSlice.actions;
export default confirmedTicketDetailsSlice.reducer;
