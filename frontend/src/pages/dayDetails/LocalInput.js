import React, { useState } from "react";
import { TextField, makeStyles, CircularProgress } from "@material-ui/core";
import { updateLocalObservation } from "../../services";
import PropTypes from "prop-types";
const useStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  textInput: {
    width: "50px",
  },
  loadingCircle: {
    marginRight: "10px"
  }
});

const LocalInput = (props) => {

  const [date] = useState(props.date);
  const [observatory] = useState(props.observatory);
  const [value, setValue] = useState(props.count);
  const [species] = useState(props.species);
  const [gau] = useState(props.gau);
  const [showCircularProgress, setShowCircularProgress] = useState(false);

  const classes = useStyles();

  const handleInput = async (event) => {
    setShowCircularProgress(true);
    setValue(event.target.value);
    // props.onChange();
    try {
      await updateLocalObservation(date, observatory, species, event.target.value, gau);
    } catch (error) {
      console.log("error: ", error);
      alert("Tallennus epäonnistui!");
    }
    setShowCircularProgress(false);
  };

  return(
    <div className={classes.container}>
      {showCircularProgress && <CircularProgress className={classes.loadingCircle} size={30} />}
      <TextField id="standard-basic" className={classes.textInput}
        variant="standard" type="number" size="small" value={value} species={species} onChange={(event) => handleInput(event)} InputProps={{
          inputProps: {
            min: 0
          }
        }}/>
    </div>
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