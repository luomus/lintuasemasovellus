import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import store from "./store";
import { HashRouter as Router } from "react-router-dom";
import "./i18n";
import { ThemeProvider } from "@mui/material/styles";
import StyledEngineProvider from "@mui/material/StyledEngineProvider";
import theme from "./theme/themeSettings";

const root = createRoot(document.getElementById("root"));

root.render(
  <ThemeProvider theme={theme}>
    <StyledEngineProvider injectFirst>
      <Provider store={store}>
        <Router>
          <App />
        </Router>
      </Provider>
    </StyledEngineProvider>
  </ThemeProvider>
);

if (window.Cypress) {
  window.store = store;
}
