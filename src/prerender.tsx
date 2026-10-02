import { renderToString } from "react-dom/server";
import { App, PageBoundary } from "./App";
import { type Language } from "./content";

export function render(language: Language) {
  return renderToString(<PageBoundary language={language}><App language={language} /></PageBoundary>);
}
