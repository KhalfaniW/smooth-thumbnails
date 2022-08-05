import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

const containerId = "SMOOTH_INJECT_APP";

function init() {
  const alreadInitialized = Boolean(document.getElementById(containerId));
  const isNotInHomepage = !(
    window.location.hostname === "www.youtube.com" &&
    window.location.pathname === "/"
  );
 
  const isDisabled =
    isNotInHomepage && process.env.REACT_APP_ENVIRONMENT.slice(0, 3) !== "DEV";
  if (isDisabled) return;
  let rootElement = document.createElement("div");

  rootElement.id = containerId;
  document.body.prepend(rootElement);

  const root = ReactDOM.createRoot(document.getElementById(containerId));
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}
init();
