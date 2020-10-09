import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  makeStyles, Paper, Snackbar,
  Select, TextField, Button,
  Typography, MenuItem,
  FormControl, InputLabel
} from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { postObservationPeriod } from "../../services";



const useStyles = makeStyles({
  paper: {
    background: "white",
    padding: "20px 30px",
    margin: "0px 0px 50px 0px",
  },
});
const DayDetails = () => {

  const { t } = useTranslation();

  const [location, setLocation] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [type, setType] = useState("");

  const { day } = useParams();

  const classes = useStyles();
  const [formSent, setFormSent] = useState(false);
  const [errorHappened, setErrorHappened] = useState(false);

  const addObservationPeriod = (event) => {

    event.preventDefault();
    postObservationPeriod({
      location: location,
      startTime: startTime,
      endTime: endTime,
      type: type
    })
      .then((res) => {
        if (res.status !== 200) {
          setErrorHappened(true);
        } else {
          setFormSent(true);
          setLocation("");
          setStartTime("");
          setEndTime("");
          setType("");
        }

      })
      .catch(() => setErrorHappened(true));

  }


  return (
    <div>
      <Paper className={classes.paper}>
        <Typography variant="h5" component="h2" >
          {day}
        </Typography>
        <br />
        <form className={classes.root} onSubmit={addObservationPeriod}>
          <TextField required
            id="location"
            label={t("location")}
            onChange={(event) => setLocation(event.target.value)}
            value={location}
          />
          <br />
          <TextField
            id="startTime"
            label="startTime"
            type="time"
            defaultValue="07:30"
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
            defaultValue="07:30"
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

        </form>
      </Paper>
    </div>
  );
};

export default DayDetails;
