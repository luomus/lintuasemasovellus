import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  makeStyles, Paper,
  TextField, Button,
  Typography,
  Snackbar,
} from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { postObservationPeriod } from "../../services";
import ObsStation from "../../globalComponents/ObsStation";
import LocationSelector from "./LocationSelector";
import Alert from "../../globalComponents/Alert";



const useStyles = makeStyles({
  paper: {
    background: "white",
    padding: "20px 30px",
    margin: "0px 0px 50px 0px",
  },
});
const DayDetails = () => {

  const { t } = useTranslation();

  const [locationId, setLocationId] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [type, setType] = useState("");

  const { day, stationId } = useParams();

  const classes = useStyles();
  const [formSent, setFormSent] = useState(false);
  const [errorHappened, setErrorHappened] = useState(false);

  const addObservationPeriod = (event) => {
    event.preventDefault();
    // Add day_id
    postObservationPeriod({
      location_id: locationId,
      startTime: startTime,
      endTime: endTime,
      observationType: type,
      day_id: 1
    })
      .then((res) => {
        if (res.status !== 200) {
          setErrorHappened(true);
        } else {
          setFormSent(true);
          setLocationId("");
          setStartTime("");
          setEndTime("");
          setType("");
        }

      })
      .catch(() => setErrorHappened(true));
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setFormSent(false);
    setErrorHappened(false);
  };



  return (
    <div>
      <Paper className={classes.paper}>
        <Typography variant="h5" component="h2" > {" "}
          {day} {" "}
          <ObsStation id={Number(stationId)} />
        </Typography>
        <br />
        <form className={classes.root} onSubmit={addObservationPeriod}>
          <LocationSelector
            stationId={stationId}
            locationId={locationId}
            setLocationId={setLocationId}
          />
          <br />
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
          <br />
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
          <br />
          <TextField required
            id="type"
            label={t("type")}
            onChange={(event) => setType(event.target.value)}
            value={type}
          />
          <br />
          <Button
            variant="contained"
            color="primary"
            disableElevation
            type="submit">
            {t("save")}
          </Button>
          <Snackbar open={formSent} autoHideDuration={5000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="success">
              {t("formSent")}
            </Alert>
          </Snackbar>
          <Snackbar open={errorHappened} autoHideDuration={5000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="error">
              {t("formNotSent")}
            </Alert>
          </Snackbar>
        </form>
      </Paper>
    </div>
  );
};

export default DayDetails;
