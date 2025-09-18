import ReactDOM from "react-dom/client";
import ConfirmedTicketDetails from "./components/ConfirmedTicketDetails";
import appStore from "./store/appStore";
import Login from "./components/Login";
import TicketHistory from "./components/TicketHistory";
import StationsDetails from "./components/StationsDetails";
import Payment from "./components/Payment";
import PassengerDetails from "./components/PassengerDetails";
import Error from "./components/Error";
import { Provider } from "react-redux";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router";
import Menu from "./components/Menu";
export default function App() {
  return (
    <Provider store={appStore}>
      <div>
        <Outlet />
      </div>
    </Provider>
  );
}
const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Login />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/menu",
        element: <Menu />,
      },
      {
        path: "/station-details",
        element: <StationsDetails />,
      },
      {
        path: "/passenger-details",
        element: <PassengerDetails />,
      },
      {
        path: "/ticket-history",
        element: <TicketHistory />,
      },
      {
        path: "/confirm-ticket",
        element: <ConfirmedTicketDetails />,
      },
      {
        path: "/payment",
        element: <Payment />,
      },
      /*
      {
        path: "/reviewbooking",
        element: <ReviewBooking />,
      },
      {
        path: "/confirmticket",
        element: <ConfirmTicket />,
      },
      {
        path: "/my-ticket-history",
        element: <TicketHistory />,
      },*/
      ,
      ,
    ],
    errorElement: <Error />,
  },
]);
ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={appRouter}>
    <App />
  </RouterProvider>
);
