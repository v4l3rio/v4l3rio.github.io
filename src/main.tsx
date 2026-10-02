import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { App, PageBoundary } from "./App";
import "./index.css";
import "./portfolio.css";

const language = document.documentElement.lang === "it" || location.pathname.startsWith("/it") ? "it" : "en";
const root = document.getElementById("root")!;
const page = <StrictMode><PageBoundary language={language}><App language={language} /></PageBoundary></StrictMode>;
if (root.hasChildNodes()) hydrateRoot(root, page);
else createRoot(root).render(page);
