import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Paper, Grid, Typography, CircularProgress
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { GeneralDayDetails } from "./generalDayDetails";
import { ObservationEdit } from "./observationEdit";
import { refreshDays } from "../../reducers/daysReducer";
import LoadingSpinner from "../../globalComponents/LoadingSpinner";
import { AppContext } from "../../AppContext";
import { clearFormData, setFormData } from "../../reducers/formDataReducer/formDataReducer";
import { dayInfoToFormData, searchDayInfo } from "../../services";
import { useConfirmExit } from "../../hooks/useConfirmExit";
import { clearFormState } from "../../reducers/formStateReducer/formStateReducer";

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
  const saving = useSelector(state => state.formState.saveState.saving);

  const [dayId, setDayId] = useState();
  const [loading, setLoading] = useState(true);

  useConfirmExit(
    () => saving,
    () => {
      setLoading(true);
      dispatch(clearFormState());
      dispatch(clearFormData(observatory));
    }
  );

  useEffect(() => {
    dispatch(clearFormState());
    dispatch(refreshDays());
  }, []);

  useEffect(() => {
    if (!dayList) {
      return;
    }
    const thisDay = dayList.find(d => d.day === day && d.observatory === observatory) || null;
    setDayId(thisDay ? thisDay.id : null);
    if (thisDay) {
      setInitialFormData(day).then(() => {
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [dayList, day, observatory]);

  const setInitialFormData = async (day) => {
    const dayInfo = await searchDayInfo(day, observatory);
    const initialFormData = dayInfoToFormData(day, dayInfo, observatory);
    await dispatch(setFormData(initialFormData));
  };

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
                {saving && <CircularProgress style={{ marginLeft: "6px" }} size={20}/>}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <GeneralDayDetails dayId={dayId}></GeneralDayDetails>
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
