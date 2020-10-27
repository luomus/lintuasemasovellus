import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Button,
  makeStyles, Paper,
  Snackbar,
  Typography
} from "@material-ui/core";
import InputGrid from "./InputGrid";
import { useTranslation } from "react-i18next";
import ObsPeriodTable from "./ObsPeriodTable";
import { getDaysObservationPeriods, postObservationPeriod } from "../../services";
import Alert from "@material-ui/lab/Alert";
import { useSelector } from "react-redux";



const DayDetails = () => {

  const { day, stationName } = useParams();

  
  const useStyles = makeStyles({
    paper: {
      background: "white",
      padding: "20px 30px",
      margin: "0px 0px 50px 0px",
    },
    root: {
      "& .MuiFormControl-root": {
        width: "70%",
        margin: "1em"
      }
    },
  });

  const classes = useStyles();
  const { t } = useTranslation();
  const [formSent, setFormSent] = useState(false);
  const [errorHappened, setErrorHappened] = useState(false);

  // State of this form page:
  const [locationName, setLocationName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [observationType, setObservationType] = useState("");
  const [locations, setLocations] = useState([]);
  const [obsPeriods, setObsperiods] = useState([]);
  const [species, setSpecies] = useState("");
  const [shorthand, setShorthand] = useState("");

  const state = {
    locationName, setLocationName,
    startTime, setStartTime,
    endTime, setEndTime,
    locations, setLocations,
    species, setSpecies,
    shorthand, setShorthand,
    obsPeriods, setObsperiods,
    observationType, setObservationType,
  };

  const dayList = useSelector(state => state.days);
  const dayId = dayList
    .find(d => d.day === day && d.observatory === stationName)
    .id;
  console.log("found dayId inside daydetailspage:", dayId);


  console.log("daydetailspage daylist:", dayList);

  const addObservationPeriod = (event) => {
    event.preventDefault();
    postObservationPeriod({
      location: locationName,
      startTime: startTime,
      endTime: endTime,
      observationType: observationType,
      day_id: dayId
    })
      .then((res) => {
        if (res.status !== 200) {
          setErrorHappened(true);
        } else {
          setFormSent(true);
          setLocationName("");
          setStartTime("");
          setEndTime("");
          setObservationType("");
        }

      })
      .catch(() => setErrorHappened(true));
  };


  useEffect(() => {
    getDaysObservationPeriods(dayId)
      .then(periodsJson => setObsperiods(periodsJson));
  }, [formSent, dayId]);

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
        <Typography variant="h5" component="h2" >
          {day} {" "}
          { stationName }
        </Typography>
        <br />
        <form className={classes.root} onSubmit={addObservationPeriod}>
          <InputGrid
            stationName={stationName}
            {...state}
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
        <br />
        <ObsPeriodTable
          obsPeriods={obsPeriods}
        />
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
      </Paper>
    </div>
  );
};

export default DayDetails;