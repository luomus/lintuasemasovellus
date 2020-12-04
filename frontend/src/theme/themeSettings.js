import {
  createMuiTheme, responsiveFontSizes
} from "@material-ui/core/styles";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#7fa149",
    },
    secondary: {
      main: "#bf1f13",
    },
    navbar: {
      main: "#514134",
    },
  },
});

export default responsiveFontSizes(theme);
