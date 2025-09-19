import React from "react";
import "./index.css";
import { Provider } from "react-redux";
import appStore from "./store/appStore";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <Provider store={appStore}>
      <div>
        <Outlet /> {/* 👈 This should render Login/Menu/etc */}
      </div>
    </Provider>
  );
}

export default App;
