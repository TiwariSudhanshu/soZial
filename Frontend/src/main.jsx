import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './index.css'
import { PersistGate } from 'redux-persist/integration/react'
import { Provider } from "react-redux";
import { store, persistor } from "../app/store.js";
createRoot(document.getElementById("root")).render(
  <StrictMode>
        <Provider store={store}>
        <PersistGate persistor={persistor}>
    <App />
    </PersistGate>
    </Provider>
    <ToastContainer />
  </StrictMode>
);
