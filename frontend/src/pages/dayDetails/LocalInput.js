import React /*, { useState }*/ from "react";
import { TextField, makeStyles/*, CircularProgress*/ } from "@material-ui/core";
import { updateLocalObservation, updateScatterObservation } from "../../services";
import PropTypes from "prop-types";

const useStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  textInput: {
    width: "75px",
  },
  loadingCircle: {
    marginRight: "20px"
  }
});

const LocalInput = ({ date, observatory, count, species, dataType, onChange, inputRef }) => {

  //const [showCircularProgress, setShowCircularProgress] = useState(false);

  const classes = useStyles();

  const handleInput = async (event) => {
    event.preventDefault();
    if (parseInt(event.target.value) !== count && Number.isInteger(parseInt(event.target.value))) {
      onChange(parseInt(event.target.value));
      //setTimeout(() => {
      // setShowCircularProgress(true);
      //}, 1500);
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
      //setTimeout(() => {
      //  setShowCircularProgress(false);
      //}, 2000);
    }
  };

  return (
    <div className={classes.container}>
      {/*showCircularProgress && <CircularProgress className={classes.loadingCircle} size={30} />*/}
      <TextField id="standard-basic" name={dataType} className={classes.textInput} ref={inputRef}
        variant="standard" type="number" size="small" species={species} onBlur={handleInput} InputProps={{
          inputProps: {
            min: 0,
            defaultValue: count,
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
  total: PropTypes.number,
  inputRef: PropTypes.any,
};