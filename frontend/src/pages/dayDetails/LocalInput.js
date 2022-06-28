import React, { useState } from "react";
import { TextField, makeStyles, CircularProgress } from "@material-ui/core";
import { updateLocalObservation, updateScatterObservation } from "../../services";
import PropTypes from "prop-types";

const useStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
    //justifyContent: "right"
  },
  textInput: {
    width: "50px",
  },
  loadingCircle: {
    marginRight: "10px"
  }
});

const LocalInput = ({ date, observatory, count, species, dataType, onChange }) => {

  //const [value, setValue] = useState(count);
  const [showCircularProgress, setShowCircularProgress] = useState(false);

  const classes = useStyles();

  const handleInput = async (event) => {
    setShowCircularProgress(true);
    //const newValue = parseInt(event.taget.value);
    onChange(parseInt(event.target.value));
    //setValue(event.target.value);
    //onChange(total+(newValue-oldValue));
    try {
      if (dataType.includes("local")) {
        await updateLocalObservation(date, observatory, species, event.target.value, dataType === "localGau" ? 1 : 0);
      }
      if (dataType === "scatter") {
        await updateScatterObservation(date, observatory, species, event.target.value);
      }
    } catch (error) {
      console.log("error: ", error);
      alert("Tallennus epäonnistui!");
    }
    setShowCircularProgress(false);
  };

  return (
    <div className={classes.container}>
      {showCircularProgress && <CircularProgress className={classes.loadingCircle} size={30} />}
      <TextField id="standard-basic" name={dataType} className={classes.textInput}
        variant="standard" type="number" size="small" value={count} species={species} onChange={(event) => handleInput(event)} InputProps={{
          inputProps: {
            min: 0
          }
        }} />
    </div>
  );
};

export default LocalInput;

LocalInput.propTypes = {
  date: PropTypes.string,
  observatory: PropTypes.string,
  count: PropTypes.number,
  species: PropTypes.string,
  dataType: PropTypes.string,
  onChange: PropTypes.any,
  total: PropTypes.number
};