import React, { useContext, useEffect, useState } from "react";
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
import { dayInfoToFormData, searchDayInfo } from "../../services";
import { useConfirmExit } from "../../hooks/useConfirmExit";
import { resetNotifications } from "../../reducers/notificationsReducer";
import { resetSavingState } from "../../reducers/savingStateReducer";

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

  const saving = useSelector(state => state.savingState.saving);

  const [dayId, setDayId] = useState();
  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState();

  useConfirmExit(
    () => saving,
    () => {
      dispatch(resetNotifications());
      dispatch(resetSavingState());
    }
  );

  useEffect(() => {
    setLoading(true);
    setInitialDayData(day).then(() => {
      setLoading(false);
    });
  }, [day, observatory]);

  const setInitialDayData = async (day) => {
    const dayInfo = await searchDayInfo(day, observatory);
    setDayId(dayInfo.id);
    setInitialData(dayInfoToFormData(day, dayInfo, station.defaultActions));
  };

  if (loading) {
    return (
      <LoadingSpinner/>
    );
  } else if (dayId === undefined || dayId === null) {
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
                {saving && <CircularProgress style={{ marginLeft: "6px" }} size={20}/>}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <GeneralDayDetails
                dayId={dayId}
                initialData={initialData}
              ></GeneralDayDetails>
            </Grid>
            <Grid item xs={12}>
              <ObservationEdit day={day} dayId={dayId}></ObservationEdit>
            </Grid>
          </Grid>
        </Paper>
      </>
    );
  }
};
