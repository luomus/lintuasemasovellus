import React from "react";
import PropTypes from "prop-types";


const Inputfield = (props) => {

  return (
    <>
      <div>
        {props.labelText}
      </div>
      <input
        type={props.type}
        value={props.value}
        onChange={props.onChange}
      ></input>
    </>
  );
};

Inputfield.propTypes = {
  type: PropTypes.string.isRequired,
  labelText: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};

export default Inputfield;
