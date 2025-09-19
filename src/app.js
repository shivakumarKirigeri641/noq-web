import { Provider } from "react-redux";
import appStore from "./store/appStore";
import { Outlet } from "react-router-dom";

export default function App() {
  return (
    <Provider store={appStore}>
      <div>
        <Outlet />
      </div>
    </Provider>
  );
}
