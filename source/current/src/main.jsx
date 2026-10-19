import './style-entry.js';
import React from "react";
import { createRoot } from "react-dom/client";
import { SiteV9 } from "./SiteV9.jsx";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SiteV9 />
  </React.StrictMode>,
);
