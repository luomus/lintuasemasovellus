import React, { memo } from "react";
import { TextField } from "@mui/material";
import PropTypes from "prop-types";

const TextInput = ({ id, label, value, onChange, required, rows, errorText }) => {
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
      error={!!errorText}
      helperText={errorText}
    />
  );
};

TextInput.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool,
  rows: PropTypes.number,
  errorText: PropTypes.string,
};

export default memo(TextInput);
