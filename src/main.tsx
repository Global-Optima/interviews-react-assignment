import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { enableMockServiceWorker } from "./mocks/browser.ts";
import { BrowserRouter } from "react-router-dom";

enableMockServiceWorker().then(() => {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
});
