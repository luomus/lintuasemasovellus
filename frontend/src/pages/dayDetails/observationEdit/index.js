import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box, Grid
} from "@mui/material";
import PropTypes from "prop-types";
import AntTabs from "./AntTabs";

import {
  getDaysObservationPeriods,
  getSummary
} from "../../../services";
import { ShorthandEdit } from "./ShorthandEdit";
import SpeciesTable from "./SpeciesTable";
import PeriodTable from "./PeriodTable";


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
  }, [dayId, mode]);

  const refetchObservations = useCallback(async () => {
    const res = await getDaysObservationPeriods(dayId);
    setObsperiods(res);
    const res2 = await getSummary(dayId);
    setSummary(res2);
  }, [dayId]);

  const table = mode === "speciesTable" ? (
    <SpeciesTable
      date={day}
      summary={summary}
      userObservatory={userObservatory}
    ></SpeciesTable>
  ) : (
    <PeriodTable
      date={day}
      obsPeriods={obsPeriods}
      refetchObservations={refetchObservations}
    ></PeriodTable>
  );

  return (
    <Grid container style={{ justifyContent: "space-between" }}>
      <Grid item xs={1}>
        <Box display="flex" justifyContent="flex-start">
          <AntTabs setMode={setMode}/>
        </Box>
      </Grid>
      <Grid item xs={5}>
        <ShorthandEdit day={day} dayId={dayId} onEditShorthandClose={refetchObservations}></ShorthandEdit>
      </Grid>
      <Grid item xs={12}>
        {table}
      </Grid>
    </Grid>
  );
};

ObservationEdit.propTypes = {
  userObservatory: PropTypes.string.isRequired,
  dayId: PropTypes.number.isRequired
};
