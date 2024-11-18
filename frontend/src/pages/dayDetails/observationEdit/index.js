import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box, Grid
} from "@mui/material";
import PropTypes from "prop-types";
import ObsPeriodTable from "./ObsPeriodTable";
import AntTabs from "./AntTabs";

import {
  getDaysObservationPeriods,
  getSummary
} from "../../../services";
import { ShorthandEdit } from "./ShorthandEdit";


export const ObservationEdit = ({ userObservatory, dayId }) => {
  const { day } = useParams();

  const [obsPeriods, setObsperiods] = useState([]);
  const [summary, setSummary] = useState([]);
  const [mode, setMode] = useState("speciesTable");

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

  const refetchObservations = useCallback(async () => {
    const res = await getDaysObservationPeriods(dayId);
    setObsperiods(res);
    const res2 = await getSummary(dayId);
    setSummary(res2);
  }, [dayId]);

  const refetchSummary = useCallback(async () => {
    const res2 = await getSummary(dayId);
    setSummary(res2);
  }, [dayId]);

  const handleEditShorthandClose = useCallback(() => {
    refetchObservations();
  }, []);

  return (
    <>
      <Grid container style={{ justifyContent: "space-between" }}>
        <Grid item xs={1}>
          <Box display="flex" justifyContent="flex-start">
            <AntTabs setMode={setMode}/>
          </Box>
        </Grid>
        <Grid item xs={5}>
          <ShorthandEdit day={day} dayId={dayId} onEditShorthandClose={handleEditShorthandClose}></ShorthandEdit>
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
    </>
  );
};

ObservationEdit.propTypes = {
  userObservatory: PropTypes.string.isRequired,
  dayId: PropTypes.number.isRequired
};
