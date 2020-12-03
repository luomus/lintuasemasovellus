import {
  createMuiTheme, responsiveFontSizes
} from "@material-ui/core/styles";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#7fa149",
    },
    secondary: {
      main: "#ffffff",
    },
    error: {
      main: "#ff0000",
    },
    navbar: {
      main: "#514134",
    },
  },
});

export default responsiveFontSizes(theme);
