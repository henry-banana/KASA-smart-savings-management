import React from "react";
import { render as rtlRender } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

/**
 * Custom render function that wraps component with necessary providers
 * (Router, contexts, etc.) for component testing.
 */
function render(ui, { initialRoute = "/", ...renderOptions } = {}) {
  window.history.pushState({}, "Test page", initialRoute);

  function Wrapper({ children }) {
    return <BrowserRouter>{children}</BrowserRouter>;
  }

  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}

export * from "@testing-library/react";
export { render };
