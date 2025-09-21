import { createBrowserRouter, RouterProvider } from "react-router-dom";
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import Login from "./components/Login";
import Menu from "./components/Menu";
import StationsDetails from "./components/StationsDetails";
import PassengerDetails from "./components/PassengerDetails";
import Payment from "./components/Payment";
import Error from "./components/Error";
import TicketHistory from "./components/TicketHistory";
import ConfirmedTicketDetails from "./components/ConfirmedTicketDetails";

// TEMP: comment other routes until you verify it works
const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Login /> },
      { path: "/login", element: <Login /> },
      { path: "/menu", element: <Menu /> },
      { path: "/station-details", element: <StationsDetails /> },
      { path: "/passenger-details", element: <PassengerDetails /> },
      { path: "/ticket-history", element: <TicketHistory /> },
      { path: "/payment", element: <Payment /> },
      { path: "/confirm-ticket", element: <ConfirmedTicketDetails /> },
    ],
    errorElement: <Error />, // disable for now
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={appRouter} />
  </React.StrictMode>
);
