import { createTheme } from "@mui/material/styles";
import { responsiveFontSizes } from "@mui/material";
import { grey } from "@mui/material/colors";

const theme = createTheme({
  components: {
    MuiTextField: {
      defaultProps: {
        variant: "standard"
      },
    },
    MuiSelect: {
      defaultProps: {
        variant: "standard"
      },
    },
    MuiButton: {
      defaultProps: {
        color: "grey",
      },
    },
  },
  palette: {
    background: {
      default: grey[50]
    },
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
    grey: {
      main: grey[300],
      dark: grey[400]
    }
  },
  typography: {
    fontSize: 12.3,
  }
});

export default responsiveFontSizes(theme);
