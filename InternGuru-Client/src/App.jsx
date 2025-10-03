import React from "react";
import { Outlet } from "react-router-dom";
import { Provider } from "react-redux";
import { persistor, store } from "./Store/app-store";
import { PersistGate } from "redux-persist/integration/react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ToastContainer 
          position="top-right" 
          autoClose={3000} 
          hideProgressBar={false} 
          closeOnClick 
          pauseOnHover 
          draggable 
          theme="light" 
        />
        <Outlet />
      </PersistGate>
    </Provider>
  );
};

export default App;
