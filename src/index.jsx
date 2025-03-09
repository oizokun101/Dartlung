import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Webpage } from "./screens/Webpage";

createRoot(document.getElementById("app")).render(
  <StrictMode>
    <Webpage />
  </StrictMode>
);
