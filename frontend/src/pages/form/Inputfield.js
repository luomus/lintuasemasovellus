import React from "react";
import PropTypes from "prop-types";


const Inputfield = (props) => {

  return (
    <>
      <div>
        {props.labelText}
      </div>
      <input
        value={props.value}
        onChange={props.changeListener}
      ></input>
    </>
  );
};

Inputfield.propTypes = {
  labelText: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  changeListener: PropTypes.func.isRequired
};

export default Inputfield;
