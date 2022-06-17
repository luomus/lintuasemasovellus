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
  const [value, setValue] = useState(props.count);
  const [species] = useState(props.species);
  // const [totalCount, setTotalCount] = useState(0);
  // const [localCount, setLocalCount] = useState(0);
  // const [localGåuCount, setLocalGåuCount] = useState(0);

  const classes = useStyles();

  const handleInput = (event) => {
    setValue(event.target.value);
    console.log("NOTGAU");
    console.log(date);
    console.log("wwwwwwww");
    updateLocalObservation(date, species, event.target.value);
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
  count: PropTypes.any,
  species: PropTypes.any,
};