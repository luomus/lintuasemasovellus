import React from "react";
import PropTypes from "prop-types";
import helpIcon from "../resources/helpIcon.svg";

const Help = (props) => {
  return(
    <img src={helpIcon}
      height="25"
      alt="helpIcon.svg"
      title={props.title}
    />
  );
};

Help.propTypes = {
  title: PropTypes.string
};

export default Help;