import ReactDOM from "react-dom/client";
import appStore from "./store/appStore";
import Login from "./components/Login";
import StationsDetails from "./components/StationsDetails";
import PassengerDetails from "./components/PassengerDetails";
import Error from "./components/Error";
import { Provider } from "react-redux";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router";
import Menu from "./components/Menu";
const AppLayout = () => {
  return (
    <Provider store={appStore}>
      <div>
        <Outlet />
      </div>
    </Provider>
  );
};
const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
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
      } /*
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
      },*/,
      ,
    ],
    errorElement: <Error />,
  },
]);
ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={appRouter}>
    <AppLayout />
  </RouterProvider>
);
