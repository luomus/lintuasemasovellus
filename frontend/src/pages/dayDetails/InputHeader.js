import { Grid, makeStyles, TextField } from "@material-ui/core";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import LocationSelector from "./LocationSelector";
import PropTypes from "prop-types";


const InputHeader = (
  { stationId, selectedLinetype, setSelectedLinetype }) => {

  const useStyles = makeStyles({
    paper: {
      background: "white",
      padding: "20px 30px",
      margin: "0px 0px 50px 0px",
    },
  });

  const classes = useStyles();
  const [locationId, setLocationId] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const { t } = useTranslation();

  return (
    <>
      <Grid item xs={3}>
        <LocationSelector
          stationId={stationId}
          locationId={locationId}
          setLocationId={setLocationId}
        />
      </Grid>
      <Grid item xs={3}>
        <TextField
          id="startTime"
          label="startTime"
          type="time"
          value={startTime}
          onChange={(event) => setStartTime(event.target.value)}
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
          value={endTime}
          onChange={(event) => setEndTime(event.target.value)}
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
          onChange={(event) => setSelectedLinetype(event.target.value)}
          value={selectedLinetype}
        />
      </Grid>
    </>
  );
};

InputHeader.propTypes = {
  stationId: PropTypes.string.isRequired,
  selectedLinetype: PropTypes.string.isRequired,
  setSelectedLinetype: PropTypes.func.isRequired
};

export default InputHeader;
