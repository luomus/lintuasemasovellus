import {
  createMuiTheme, responsiveFontSizes
} from "@material-ui/core/styles";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#2691d9",
    },
    secondary: {
      main: "#ecc94b",
    },
    error: {
      main: "#c53030",
    },
    navbar: {
      main: "#2691d9",
    },
  },
});

export default responsiveFontSizes(theme);
