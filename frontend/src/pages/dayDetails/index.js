import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Button, Box, Paper, Grid, Typography
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import ObsPeriodTable from "./ObsPeriodTable";
import EditShorthand from "../editShorthand";
import AntTabs from "./AntTabs";

import {
  getDaysObservationPeriods,
  getSummary
} from "../../services";
import { GeneralDayDetails } from "./generalDayDetails";

const useStyles = makeStyles((theme) => ({
    paper: {
      background: "white",
      padding: "20px 30px",
      margin: "0px 0px 50px 0px",
    }
  })
);

export const DayDetails = ({ userObservatory }) => {
  const { day } = useParams();

  const classes = useStyles();
  const { t } = useTranslation();

  const dayList = useSelector(state => state.days);

  const [obsPeriods, setObsperiods] = useState([]);
  const [summary, setSummary] = useState([]);
  const [mode, setMode] = useState("speciesTable");
  const [editShorthandModalOpen, setEditShorthandModalOpen] = useState(false);
  const [thisDay, setThisDay] = useState(null);
  const [dayId, setDayId] = useState();

  useEffect(() => {
    const thisDay = dayList.find(d => d.day === day && d.observatory === userObservatory) || null;
    setThisDay(thisDay);
    setDayId(thisDay ? thisDay.id : null);
  }, [dayList, day, userObservatory]);

  useEffect( () => {
    let fetching = false;
    getDaysObservationPeriods(dayId)
      .then(periodsJson => {
        if (!fetching) {
          setObsperiods(periodsJson);
        }
      });
    getSummary(dayId)
      .then(periodsJson => {
        if (!fetching) {
          setSummary(periodsJson);
        }
      });
    return () => (fetching = true);
  }, [dayId]);

  const handleEditShorthandOpen = useCallback(() => {
    setEditShorthandModalOpen(true);
  }, []);

  const refetchObservations = useCallback(async () => {
    const res = await getDaysObservationPeriods(dayId);
    setObsperiods(res);
    const res2 = await getSummary(dayId);
    setSummary(res2);
  }, [dayId]);

  useEffect(() => {
    refetchObservations();
  }, [mode]);

  const refetchSummary = useCallback(async () => {
    const res2 = await getSummary(dayId);
    setSummary(res2);
  }, [dayId]);

  const handleEditShorthandClose = () => {
    setEditShorthandModalOpen(false);
    refetchObservations();
  };

  if (!dayId) {
    return (<>
      <Paper className={classes.paper}>
        <Typography variant="h4" component="h2" >
          {day} {" "}
          {userObservatory.replace("_", " ")}
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
                {userObservatory.replace("_", " ")}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <GeneralDayDetails userObservatory={userObservatory} thisDay={thisDay}></GeneralDayDetails>
            </Grid>
            <Grid container style={{ justifyContent: "space-between" }}>
              <Grid item xs={1}>
                <Box display="flex" justifyContent="flex-start">
                  <AntTabs setMode={setMode}/>
                </Box>
              </Grid>
              <Grid item xs={5}>
                <Box display="flex" justifyContent="flex-end">
                  <Button variant="contained" color="primary" onClick={handleEditShorthandOpen}>
                    {t("editObservations")}
                  </Button>{" "}
                </Box>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <ObsPeriodTable
                key={day}
                date={day}
                obsPeriods={obsPeriods}
                summary={summary}
                mode={mode}
                userObservatory={userObservatory}
                refetchObservations={refetchObservations}
                refetchSummary={refetchSummary}
              />
            </Grid>
          </Grid>
          <EditShorthand
            date={day}
            dayId={dayId}
            open={editShorthandModalOpen}
            handleCloseModal={handleEditShorthandClose}
          />
        </Paper>
      </>
    );
  }
};

DayDetails.propTypes = {
  userObservatory: PropTypes.string.isRequired
};
