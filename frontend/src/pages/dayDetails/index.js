import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Paper, Grid, Typography
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { GeneralDayDetails } from "./generalDayDetails";
import { ObservationEdit } from "./observationEdit";
import { refreshDays } from "../../reducers/daysReducer";
import LoadingSpinner from "../../globalComponents/LoadingSpinner";
import { AppContext } from "../../AppContext";

const useStyles = makeStyles(() => ({
  paper: {
    background: "white",
    padding: "20px 30px"
  }
})
);

export const DayDetails = () => {
  const { day } = useParams();

  const classes = useStyles();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { observatory } = useContext(AppContext);

  const dayList = useSelector(state => state.days);

  const [thisDay, setThisDay] = useState(null);
  const [dayId, setDayId] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(refreshDays());
  }, []);

  useEffect(() => {
    if (!dayList) {
      return;
    }
    const thisDay = dayList.find(d => d.day === day && d.observatory === observatory) || null;
    setThisDay(thisDay);
    setDayId(thisDay ? thisDay.id : null);
    setLoading(false);
  }, [dayList, day, observatory]);

  if (loading) {
    return (
      <LoadingSpinner/>
    );
  } else if (!dayId) {
    return (<>
      <Paper className={classes.paper}>
        <Typography variant="h4" component="h2" >
          {day} {" "}
          {observatory.replace("_", " ")}
        </Typography>
        <Typography>
          {t("noObservationsFound")}
        </Typography>
      </Paper>
    </>);
  } else {
    return (
      <>
        <Paper className={classes.paper}>
          <Grid container alignItems="flex-end" spacing={3}>
            <Grid item xs={12}>
              <Typography id="dayAndObservatory" variant="h4" component="h2" >
                {day} {" "}
                {observatory.replace("_", " ")}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <GeneralDayDetails thisDay={thisDay}></GeneralDayDetails>
            </Grid>
            <Grid item xs={12}>
              <ObservationEdit dayList={dayList} dayId={dayId}></ObservationEdit>
            </Grid>
          </Grid>
        </Paper>
      </>
    );
  }
};
