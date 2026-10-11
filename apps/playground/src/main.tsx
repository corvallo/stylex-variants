import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import * as stylex from "@stylexjs/stylex";
import { App } from "./app/App";
import { documentStyles } from "./app/document.stylex";
import "./index.css";

document.body.className = stylex.props(documentStyles.body).className ?? "";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
