import React from "react";
import { makeStyles } from "@mui/styles";
import PropTypes from "prop-types";

const useStyles = makeStyles({
  spinnerContainer: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column"
  },
  spinner: {
    padding: "0px",
    margin: "60px 60px",
    fontSize: "10px",
    position: "relative",
    borderTop: "1.1em solid lightgrey",
    borderRight: "1.1em solid lightgrey",
    borderBottom: "1.1em solid lightgrey",
    borderLeft: "1.1em solid #2691d9",
    animation: "$spin 1.1s infinite linear",
    "&, :after": {
      borderRadius: "50%",
      width: "10em",
      height: "10em",
    },
  },
  "@keyframes spin": {
    "0%": {
      transform: "rotate(0deg)",
    },
    "100%": {
      transform: "rotate(360deg)",
    },
  },
  smallSpinner: {
    margin: "30px 30px",
    "&, :after": {
      width: "5em",
      height: "5em",
    }
  }
});

const LoadingSpinner = ({ size }) => {
  const classes = useStyles();

  return (
    <div className={classes.spinnerContainer}>
      <div className={classes.spinner + " " + (size === "small" ? classes.smallSpinner : "")}>
      </div>
    </div>
  );
};

export default LoadingSpinner;

LoadingSpinner.propTypes = {
  size: PropTypes.string
};
