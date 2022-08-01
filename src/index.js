import * as
React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

let rootElement = document.createElement("div");
const conatinerId = "SMOOTH_INJECT_APP";
rootElement.id = conatinerId;
document.body.prepend(rootElement);

const root = ReactDOM.createRoot(document.getElementById(conatinerId));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
