import { FormControl, InputLabel, MenuItem, Select } from "@material-ui/core";
import React from "react";
import PropTypes from "prop-types";

const Selector = (props) => {

  const { options, ...selectorProps } = props;

  return (
    <FormControl>
      <InputLabel>{selectorProps.labelId} *</InputLabel>
      <Select required
        {...selectorProps}
      >
        {
          options.map((option, i) =>
            <MenuItem value={option} key={i}>
              {option}
            </MenuItem>
          )
        }
      </Select>
    </FormControl>
  );
};

Selector.propTypes = {
  value: PropTypes.string.isRequired,
  setter: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  labelId: PropTypes.string.isRequired,
};

export default Selector;
