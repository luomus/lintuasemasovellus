import React, { memo } from "react";
import { TextField } from "@mui/material";
import PropTypes from "prop-types";

const TextInput = ({ id, label, value, onChange, required, rows }) => {
  return (
    <TextField
      id={id}
      fullWidth={true}
      label={label}
      onChange={(event) => onChange(event.target.value)}
      value={value}
      required={required}
      rows={rows}
      multiline={rows > 1}
    />
  );
};

TextInput.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool,
  rows: PropTypes.number
};

export default memo(TextInput);
