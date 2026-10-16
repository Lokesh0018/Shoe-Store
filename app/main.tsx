import { StrictMode, Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import "./globals.css";
import "@/site/fonts";
import "@/site/site.css";
import { applySite } from "./theme";
import Home from "./page";

// /patterns is only for browsing the pattern library, so it loads on demand.
const Patterns = lazy(() => import("./patterns/page"));

applySite();

const path = window.location.pathname.replace(/\/+$/, "");
const isPatterns = path === "/patterns";
if (isPatterns) document.title = "Pattern library";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {isPatterns ? (
      <Suspense fallback={null}>
        <Patterns />
      </Suspense>
    ) : (
      <Home />
    )}
  </StrictMode>,
);
