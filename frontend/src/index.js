import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import store from "./store";
import { BrowserRouter as Router } from "react-router-dom";
import "./i18n";
import { ThemeProvider } from "@material-ui/core/styles";
import theme from "./theme/themeSettings";

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>
  </ThemeProvider>,
  document.getElementById("root")
);

if (window.Cypress) {
  window.store = store;
}
