import { Grid, makeStyles, TextField } from "@material-ui/core";
import React from "react";
import { useTranslation } from "react-i18next";
import LocationSelector from "./LocationSelector";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";


const InputHeader = (props) => {

  const { stationName, ...state } = props;

  const useStyles = makeStyles({
    paper: {
      background: "white",
      padding: "20px 30px",
      margin: "0px 0px 50px 0px",
    },
  });

  const classes = useStyles();

  const { t } = useTranslation();

  const stations = useSelector(state => state.stations);

  if (stations.length === 0) return null;

  return (
    <>
      <Grid item xs={3}>
        <LocationSelector
          stationName={stationName}
          {...state}
        />
      </Grid>
      <Grid item xs={3}>
        <TextField
          id="startTime"
          label="startTime"
          type="time"
          value={state.startTime}
          onChange={(event) => state.setStartTime(event.target.value)}
          className={classes.textField}
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            step: 300, // 5 min
          }}
        />
      </Grid>
      <Grid item xs={3}>
        <TextField
          id="endTime"
          label="endTime"
          type="time"
          value={state.endTime}
          onChange={(event) => state.setEndTime(event.target.value)}
          className={classes.textField}
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            step: 300, // 5 min
          }}
        />
      </Grid>
      <Grid item xs={3}>
        <TextField required
          id="type"
          label={t("type")}
          onChange={(event) => state.setObservationType(event.target.value)}
          value={state.observationType}
        />
      </Grid>
    </>
  );
};

InputHeader.propTypes = {
  stationName: PropTypes.string.isRequired,
  selectedLinetype: PropTypes.string.isRequired,
  setSelectedLinetype: PropTypes.func.isRequired
};

export default InputHeader;
