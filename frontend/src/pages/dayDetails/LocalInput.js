import React, { useState, useEffect } from "react";
import { TextField, makeStyles } from "@material-ui/core";
import { updateLocalObservation } from "../../services";
// import { editTotalCount, editLocalCount, editLocalGåuCount, getTotalCount, getLocalCount, getLocalGåuCount } from "../../services";
import PropTypes from "prop-types";
const useStyles = makeStyles({
  textInput: {
    width: "50px",
  }
});

const LocalInput = (props) => {

  useEffect(() => {
    // setLocalCount(getLocalCount)
    // setLocalGåuCount(getLocalGåuCount)
    // setTotalCount(getLocalTotalCount)
  },[]);
  const [date] = useState(props.date);
  const [observatory] = useState(props.observatory);
  const [value, setValue] = useState(props.count);
  const [species] = useState(props.species);
  const [gau] = useState(props.gau);
  // const [totalCount, setTotalCount] = useState(0);
  // const [localCount, setLocalCount] = useState(0);
  // const [localGåuCount, setLocalGåuCount] = useState(0);

  const classes = useStyles();

  const handleInput = (event) => {
    setValue(event.target.value);
    props.onChange();
    updateLocalObservation(date, observatory, species, event.target.value, gau);
    // editTotalCount(totalCount).then(totalCountJson => setTotalCount(totalCountJson.data.totalCount));)
    // editLocalCount(localCount).then(localCountJson => setLocalCount(localCountJson.data.localCount));
    // editLocalGåuCount(localGåuCount).then(localGåuCountJson => setLocalGåuCount(localGåuCountJson.data.localGåuCount));
  };

  return(
    <TextField id="standard-basic" className={classes.textInput}
      variant="standard" type="number" size="small" value={value} species={species} onChange={(event) => handleInput(event)} InputProps={{
        inputProps: {
          min: 0
        }
      }}/>
  );
};

export default LocalInput;

LocalInput.propTypes = {
  date: PropTypes.any,
  observatory: PropTypes.string,
  count: PropTypes.any,
  species: PropTypes.any,
  gau: PropTypes.any,
  onChange: PropTypes.any
};