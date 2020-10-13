import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Button,
  makeStyles, Paper,
  Typography
} from "@material-ui/core";
import InputGrid from "./InputGrid";
import { useTranslation } from "react-i18next";
import ObsPeriodTable from "./ObsPeriodTable";
import { postObservationPeriod } from "../../services";
import { getObservationPeriods } from "../../services";



const DayDetails = () => {


  const { day, stationId } = useParams();

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



  const addObservationPeriod = (event) => {
    event.preventDefault();
    // Add day_id
    postObservationPeriod({
      location_id: locationId,
      startTime: startTime,
      endTime: endTime,
      observationType: observationType,
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
          setObservationType("");
        }

      })
      .catch(() => setErrorHappened(true));
  };

  const [locationId, setLocationId] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [observationType, setObservationType] = useState("");
  const [locations, setLocations] = useState([]);
  const [selectedLinetype, setSelectedLinetype] = useState("");
  const [obsPeriods, setObsperiods] = useState([]);


  const [species, setSpecies] = useState("");
  const [shorthand, setShorthand] = useState("");

  const state = {
    locationId, setLocationId,
    startTime, setStartTime,
    endTime, setEndTime,
    locations, setLocations,
    species, setSpecies,
    shorthand, setShorthand,
    selectedLinetype, setSelectedLinetype,
    obsPeriods, setObsperiods,
  };

  useEffect(() => {
    getObservationPeriods()
      .then(periodsJson => setObsperiods(periodsJson));
  }, []);

  console.log("index:", state);

  return (
    <div>
      <Paper className={classes.paper}>
        <Typography variant="h5" component="h2" >
          {day} {" "}
          { stationId }
        </Typography>
        <br />
        <form className={classes.root} onSubmit={addObservationPeriod}>
          <InputGrid
            stationId={stationId}
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
      </Paper>
    </div>
  );
};

export default DayDetails;
