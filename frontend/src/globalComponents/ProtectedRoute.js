import React, { useContext } from "react";
import { Login } from "../pages";
import { useSelector } from "react-redux";
import { isLoggedInSelector } from "../reducers/userReducer";
import PropTypes from "prop-types";
import { AppContext } from "../AppContext";

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = useSelector(isLoggedInSelector);
  const context = useContext(AppContext);

  if (!isLoggedIn) {
    return <Login />;
  } else if (!context) {
    return <></>;
  }

  return <>{ children }</>;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired
};

export default ProtectedRoute;
