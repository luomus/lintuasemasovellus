import {
  createMuiTheme, responsiveFontSizes
} from "@material-ui/core/styles";
//import green from "@material-ui/core/colors/green";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#7fa149",
    },
    secondary: {
      main: "#7fa149",
    },
  },
});

export default responsiveFontSizes(theme);
