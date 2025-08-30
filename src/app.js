import ReactDOM from "react-dom/client";
import appStore from "./store/appStore";
import LoginOptions from "./components/LoginOptions";
import TrainDetails from "./components/TrainDetails";
import ConfirmTicket from "./components/ConfirmTicket";
import ReviewBooking from "./components/ReviewBooking";
import DownloadTicket from "./components/DownloadTicket";
import Home from "./components/Home";
import { Provider } from "react-redux";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router";
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
        element: <Home />,
      },
      {
        path: "/loginoptions",
        element: <LoginOptions />,
      },
      {
        path: "/traindetails",
        element: <TrainDetails />,
      },
      {
        path: "/reviewbooking",
        element: <ReviewBooking />,
      },
      {
        path: "/confirmticket",
        element: <ConfirmTicket />,
      },
      {
        path: "/downloadticket",
        element: <DownloadTicket />,
      },
    ],
    errorElement: <Error />,
  },
]);
ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={appRouter}>
    <AppLayout />
  </RouterProvider>
);
