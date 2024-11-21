import React, { useEffect, useState } from "react";
import { TextField } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { updateLocalObservation, updateScatterObservation } from "../../../services";
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

  const classes = useStyles();

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

    if (newValue !== count && Number.isInteger(newValue)) {
      onChange(newValue);
      try {
        if (dataType.includes("local")) {
          await updateLocalObservation(date, observatory, species, newValue, dataType === "localGau" ? 1 : 0);
        }
        if (dataType === "scatter") {
          await updateScatterObservation(date, observatory, species, newValue);
        }
      } catch (error) {
        console.log("error: ", error);
        alert("Tallennus epäonnistui!");
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
            min: 0,
            value: inputValue,
            disableInjectingGlobalStyles: true
          }
        }}
      ></TextField>
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
