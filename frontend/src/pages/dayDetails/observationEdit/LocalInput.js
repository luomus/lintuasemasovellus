import React, { useContext, useEffect, useState } from "react";
import { TextField, Icon, Tooltip } from "@mui/material";
import { Error } from "@mui/icons-material";
import { makeStyles } from "@mui/styles";
import { updateLocalObservation, updateScatterObservation } from "../../../services";
import PropTypes from "prop-types";
import { AppContext } from "../../../AppContext";
import { useDispatch } from "react-redux";
import { saveData } from "../../../reducers/savingStateReducer";
import { parseObservations } from "../../../shorthand/observationParsing";
import { useTranslation } from "react-i18next";
import { translateShorthandError } from "../../../shorthand/utils";

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

const LocalInput = ({ day, shorthand, species, dataType, onChange, inputRef }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const classes = useStyles();
  const { observatory } = useContext(AppContext);

  const [inputValue, setInputValue] = useState("");
  const [savingShorthand, setSavingShorthand] = useState();
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    setInputValue(shorthand);
  }, [shorthand]);

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      saveValue();
    }
  };

  const saveValue = async () => {
    const value = inputValue.trim();

    if (value === shorthand || value === savingShorthand) {
      setErrorMsg("");
      return;
    }

    let observation = { species, subObservations: [], periodOrderNum: 0 };

    if (value) {
      try {
        observation.subObservations = parseObservations(value);
      } catch (e) {
        setErrorMsg(translateShorthandError(t, e.message));
        return;
      }
    }

    onChange({ "shorthand": value, "totalCount": getTotalCount(observation) });
    setErrorMsg("");

    setSavingShorthand(value);
    if (dataType.includes("local")) {
      await dispatch(saveData(() => updateLocalObservation(day, observatory, species, value, observation, dataType === "localGau" ? 1 : 0)));
    }
    if (dataType === "scatter") {
      await dispatch(saveData(() => updateScatterObservation(day, observatory, species, value, observation)));
    }
    setSavingShorthand(undefined);
  };

  const getTotalCount = (observation) => {
    return (observation.subObservations || []).reduce((total, subObs) => (
      Object.keys(subObs).reduce((_total, field) => {
        if (!field.includes("Count")) {
          return _total;
        }
        return _total + subObs[String(field)];
      }, total)
    ), 0);
  };

  return (
    <div className={classes.container}>
      <TextField
        id="standard-basic"
        name={dataType}
        className={classes.textInput}
        ref={inputRef}
        variant="standard"
        type="text"
        size="small"
        onChange={handleChange}
        onBlur={saveValue}
        onKeyDown={handleKeyDown}
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
      <Tooltip title={errorMsg} style={{ visibility: errorMsg ? "visible" : "hidden" }}>
        <Icon color="error">
          <Error/>
        </Icon>
      </Tooltip>
    </div>
  );
};

export default LocalInput;

LocalInput.propTypes = {
  day: PropTypes.string.isRequired,
  shorthand: PropTypes.string,
  species: PropTypes.string,
  dataType: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  total: PropTypes.number,
  inputRef: PropTypes.any,
};
