import React from "react";
import PropTypes from "prop-types";
import Notification from "../Notification";


const ErrorPaper = () => {
  return (<Notification category="shorthand" />);
};

ErrorPaper.propTypes = {
  codeMirrorHasErrors: PropTypes.bool.isRequired,
};

export default ErrorPaper;