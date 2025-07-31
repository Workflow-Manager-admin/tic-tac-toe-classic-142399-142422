import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

// Pages and components are imported in App using hash-based SPA routing
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
