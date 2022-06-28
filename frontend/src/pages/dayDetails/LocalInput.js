import React, { useState } from "react";
import { TextField, makeStyles } from "@material-ui/core";
import { updateLocalObservation, updateScatterObservation } from "../../services";
import PropTypes from "prop-types";
const useStyles = makeStyles({
  textInput: {
    width: "50px",
  }
});

const LocalInput = ({ date, observatory, count, species, dataType, onChange }) => {

  /*
  const [date] = useState(date);
  const [observatory] = useState(observatory);
  */
  const [value, setValue] = useState(count);
  /*
  const [species] = useState(species);
  const [gau] = useState(dataType === "localGau" ? 1 : 0);
  */

  const classes = useStyles();

  const handleInput = (event) => {
    setValue(event.target.value);
    onChange();
    if (dataType === "localOther" || dataType === "localGau") {
      updateLocalObservation(date, observatory, species, event.target.value, dataType === "localGau" ? 1 : 0);
    }
    if (dataType === "scatter") {
      updateScatterObservation(date, observatory, species, event.target.value);
    }
  };

  return (
    <TextField id="standard-basic" name={dataType} className={classes.textInput}
      variant="standard" type="number" size="small" value={value} species={species} onChange={(event) => handleInput(event)} InputProps={{
        inputProps: {
          min: 0
        }
      }} />
  );
};

export default LocalInput;

LocalInput.propTypes = {
  date: PropTypes.string,
  observatory: PropTypes.string,
  count: PropTypes.number,
  species: PropTypes.string,
  dataType: PropTypes.string,
  onChange: PropTypes.any
};