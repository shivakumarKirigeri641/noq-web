import "./index.css";
import ReactDOM from "react-dom/client";
import App from "./App";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router";
import Login from "./components/Login";
import Menu from "./components/Menu";
import StationsDetails from "./components/StationsDetails";
import PassengerDetails from "./components/PassengerDetails";
import TicketHistory from "./components/TicketHistory";
import ConfirmedTicketDetails from "./components/ConfirmedTicketDetails";
import Payment from "./components/Payment";
import Error from "./components/Error";

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
      { path: "/confirm-ticket", element: <ConfirmedTicketDetails /> },
      { path: "/payment", element: <Payment /> },
    ],
    errorElement: <Error />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={appRouter} />
);
