import "@fontsource/cormorant-garamond/cyrillic-500-italic.css";
import "@fontsource/cormorant-garamond/latin-500-italic.css";
import React from "react";
import { createRoot } from "react-dom/client";
import { SiteV9 } from "./SiteV9.jsx";
import "./styles.css";
import "./redesign.css";
import "./sections.css";
import "./backgrounds.css";
import "./card-details.css";
import "./refinements.css";
import "./living-design.css";
import "./site-v9.css";
import "./final-composition.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SiteV9 />
  </React.StrictMode>,
);
