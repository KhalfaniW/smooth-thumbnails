import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

const containerId = "SMOOTH_INJECT_APP";

function init() {
  const alreadyInitialized = Boolean(document.getElementById(containerId));

  if (alreadyInitialized) return;
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
