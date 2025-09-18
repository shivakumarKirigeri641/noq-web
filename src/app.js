import { Provider } from "react-redux";
import appStore from "./store/appStore";
import { Outlet } from "react-router";

export default function App() {
  return (
    <Provider store={appStore}>
      <div>
        <Outlet />
      </div>
    </Provider>
  );
}
