import React from "react";
import { useParams } from "react-router-dom";
import {
  Button,
  makeStyles, Paper,
  Typography
} from "@material-ui/core";
import ObsStation from "../../globalComponents/ObsStation";
import InputGrid from "./InputGrid";
import { useTranslation } from "react-i18next";



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


  const addObservationPeriod = () => {
    // add logic...
  };

  return (
    <div>
      <Paper className={classes.paper}>
        <Typography variant="h5" component="h2" >
          {day} {" "}
          <ObsStation id={Number(stationId)} />
        </Typography>
        <br />
        <form className={classes.root} onSubmit={addObservationPeriod}>
          <InputGrid stationId={stationId} />
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
