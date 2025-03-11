import React, { useContext, useEffect, useState } from "react";
import { TextField } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { updateLocalObservation, updateScatterObservation } from "../../../services";
import PropTypes from "prop-types";
import { AppContext } from "../../../AppContext";
import { useDispatch } from "react-redux";
import { saveData } from "../../../reducers/savingStateReducer";

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

const LocalInput = ({ day, count, species, dataType, onChange, inputRef }) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const { observatory } = useContext(AppContext);

  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    setInputValue(count);
  }, [count]);

  useEffect(() => {
    const timeOutId = setTimeout(() => saveValue(), 500);
    return () => clearTimeout(timeOutId);
  }, [inputValue]);

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  const saveValue = async () => {
    const newValue = parseInt(inputValue, 10);

    if (newValue !== count && Number.isInteger(newValue) && newValue >= 0) {
      onChange(newValue);
      if (dataType.includes("local")) {
        await dispatch(saveData(() => updateLocalObservation(day, observatory, species, newValue, dataType === "localGau" ? 1 : 0)));
      }
      if (dataType === "scatter") {
        await dispatch(saveData(() => updateScatterObservation(day, observatory, species, newValue)));
      }
    }
  };

  return (
    <div className={classes.container}>
      <TextField
        id="standard-basic"
        name={dataType}
        className={classes.textInput}
        ref={inputRef}
        variant="standard"
        type="number"
        size="small"
        onChange={handleChange}
        slotProps={{
          input: {
            value: inputValue,
            disableInjectingGlobalStyles: true
          },
          htmlInput: {
            min: 0
          }
        }}
      ></TextField>
    </div>
  );
};

export default LocalInput;

LocalInput.propTypes = {
  day: PropTypes.string.isRequired,
  count: PropTypes.number,
  species: PropTypes.string,
  dataType: PropTypes.string,
  onChange: PropTypes.any,
  total: PropTypes.number,
  inputRef: PropTypes.any,
};
