import React, { memo } from "react";
import { TextField, MenuItem } from "@mui/material";
import PropTypes from "prop-types";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(0),
    minWidth: 120,
  }
}));

const Select = ({ id, label, options, value, onChange, required, errorText }) => {
  const classes = useStyles();

  return (
    <TextField
      className={classes.formControl}
      select
      required={required}
      fullWidth
      id={id}
      label={label}
      error={!!errorText}
      helperText={errorText}
      slotProps={{
        select: {
          value,
          onChange: (event) => onChange(event.target.value)
        }
      }}
    >
      {
        options.map((option, i) =>
          <MenuItem id={option} value={option} key={i}>
            {option}
          </MenuItem>
        )
      }
    </TextField>
  );
};

Select.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool,
  errorText: PropTypes.string,
};

export default memo(Select);
