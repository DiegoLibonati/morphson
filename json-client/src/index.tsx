import ReactDOM from "react-dom/client";

import App from "@src/App";

import { ModalProvider } from "@src/contexts/ModalContext/ModalContext";

import "@src/index.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <ModalProvider>
    <App />
  </ModalProvider>
);
