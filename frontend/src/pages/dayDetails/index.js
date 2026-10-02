import React, { useCallback, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Paper, Grid, Typography, CircularProgress
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import GeneralDayDetails from "./generalDayDetails";
import { ObservationEdit } from "./observationEdit";
import LoadingSpinner from "../../globalComponents/LoadingSpinner";
import { AppContext } from "../../AppContext";
import { dayInfoToFormData } from "../../services";
import { useConfirmExit } from "../../hooks/useConfirmExit";
import { resetNotifications } from "../../reducers/notificationsReducer";
import { resetSavingState } from "../../reducers/savingStateReducer";
import { refreshDayData, refreshObservationPeriods, resetDayData } from "../../reducers/dayDataReducer";

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
  const { observatory, station } = useContext(AppContext);

  const dayInfo = useSelector(state => state.dayData.data?.dayInfo);
  const loading = useSelector(state => state.dayData.loading);
  const error = useSelector((state) => state.dayData.error);
  const saving = useSelector(state => state.savingState.saving);

  const [initialData, setInitialData] = useState();

  useConfirmExit(
    () => saving,
    () => {
      dispatch(resetNotifications());
      dispatch(resetSavingState());
      dispatch(resetDayData());
    }
  );

  useEffect(() => {
    dispatch(refreshDayData(day, observatory));
  }, [day, observatory]);

  useEffect(() => {
    if (dayInfo) {
      setInitialData(dayInfoToFormData(day, dayInfo, station.defaultActions));
    }
  }, [day, dayInfo, station.defaultActions]);

  const refreshObservations = useCallback(async () => {
    if (dayInfo?.id !== undefined) {
      dispatch(refreshObservationPeriods(dayInfo.id));
    }
  }, [dayInfo?.id, dispatch]);

  if (loading) {
    return (
      <LoadingSpinner/>
    );
  } else if (error) {
    return (
      <Paper className={classes.paper}>
        <Typography variant="h6" color="error">
          {t("unexpectedError")}
        </Typography>
      </Paper>
    );
  } else if (dayInfo?.id === undefined) {
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
  } else if (initialData) {
    return (
      <>
        <Paper className={classes.paper}>
          <Grid container alignItems="flex-end" spacing={3}>
            <Grid item xs={12}>
              <Typography id="dayAndObservatory" variant="h4" component="h2" >
                {day} {" "}
                {observatory.replace("_", " ")}
                {saving && <CircularProgress style={{ marginLeft: "6px" }} size={20}/>}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <GeneralDayDetails
                dayId={dayInfo.id}
                initialData={initialData}
              ></GeneralDayDetails>
            </Grid>
            <Grid item xs={12}>
              <ObservationEdit day={day} dayId={dayInfo.id} refreshObservations={refreshObservations}></ObservationEdit>
            </Grid>
          </Grid>
        </Paper>
      </>
    );
  }
};
