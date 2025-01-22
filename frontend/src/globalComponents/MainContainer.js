import React from "react";
import PropTypes from "prop-types";
import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";
import Footer from "./Footer";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  mainContainer: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    paddingBottom: "50px",
    overflowY: "auto"
  }
});

const MainContainer = ({ showNavBar }) => {
  const classes = useStyles();

  return (
    <div className={classes.mainContainer}>
      { showNavBar && <NavBar /> }
      <Outlet />
      <Footer />
    </div>
  );
};

export default MainContainer;

MainContainer.propTypes = {
  showNavBar: PropTypes.bool
};
