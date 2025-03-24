import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  Box, Grid
} from "@mui/material";
import PropTypes from "prop-types";
import AntTabs from "./AntTabs";

import {
  getDaysObservationPeriods, getDefaultSpecies,
  getSummary
} from "../../../services";
import ShorthandEdit from "./ShorthandEdit";
import SpeciesTable from "./SpeciesTable";
import PeriodTable from "./PeriodTable";
import { AppContext } from "../../../AppContext";


export const ObservationEdit = ({ day, dayId }) => {
  const { observatory, speciesData } = useContext(AppContext);

  const [obsPeriods, setObsperiods] = useState([]);

  const [defaultSpecies, setDefaultSpecies] = useState([]);
  const [addableSpecies, setAddableSpecies] = useState([]);
  const [speciesSummary, setSpeciesSummary] = useState([]);
  const [speciesRows, setSpeciesRows] = useState([]);

  const [mode, setMode] = useState("speciesTable");

  useEffect( () => {
    let fetching = false;
    getDefaultSpecies(observatory)
      .then(defaultSpeciesJson => {
        if (!fetching) {
          setDefaultSpecies(defaultSpeciesJson);
        }
      });
    getDaysObservationPeriods(dayId)
      .then(periodsJson => {
        if (!fetching) {
          setObsperiods(periodsJson);
        }
      });
    getSummary(dayId)
      .then(summary => {
        if (!fetching) {
          setSpeciesSummary(summary);
        }
      });
    return () => (fetching = true);
  }, [observatory, dayId]);

  useEffect(() => {
    updateSpeciesRows(speciesSummary, defaultSpecies);
  }, [speciesSummary, defaultSpecies]);

  useEffect(() => {
    setAddableSpecies(speciesData.uniqueSpecies.filter(species => !defaultSpecies.includes(species)));
  }, [speciesData, defaultSpecies]);

  const refetchObservations = useCallback(async () => {
    const res = await getDaysObservationPeriods(dayId);
    setObsperiods(res);
    const res2 = await getSummary(dayId);
    setSpeciesSummary(res2);
  }, [dayId]);

  const speciesRowChange = useCallback((row) => {
    setSpeciesRows((prevState) => (
      prevState.map(obj => {
        if (obj.species === row.species) {
          return row;
        }
        return obj;
      })
    ));
  }, []);

  const addNewSpecies = useCallback((species) => {
    setAddableSpecies(prevState => prevState.filter(s => s !== species));
    setSpeciesRows((prevState) => ([...prevState, getEmptySpeciesRow(species)]));
  }, []);

  const updateSpeciesRows = (summary, defaultSpecies) => {
    const foundSpecies = [];

    const defaultRows = defaultSpecies.reduce((previous, current) => {
      const birdInSummary = summary.find(bird => bird.species === current);
      if (birdInSummary) {
        foundSpecies.push(current);
        return previous.concat(birdInSummary);
      }
      return previous.concat(getEmptySpeciesRow(current));
    }, []);

    const extraRows = summary.reduce((previous, current) => {
      if (!foundSpecies.includes(current.species)) {
        previous.push(current);
      }
      return previous;
    }, []);

    setSpeciesRows(defaultRows.concat(extraRows));
  };

  const getEmptySpeciesRow = (species) => {
    return {
      constMigration: 0,
      nightMigration: 0,
      otherMigration: 0,
      localGåu: 0,
      localOther: 0,
      scatter: 0,
      localGåuShorthand: "",
      localOtherShorthand: "",
      notes: "",
      scatterShorthand: "",
      species
    };
  };

  const table = mode === "speciesTable" ? (
    <SpeciesTable
      day={day}
      allRows={speciesRows}
      addableSpecies={addableSpecies}
      onRowChange={speciesRowChange}
      onAddNewSpecies={addNewSpecies}
    />
  ) : (
    <PeriodTable
      day={day}
      dayId={dayId}
      obsPeriods={obsPeriods}
      refetchObservations={refetchObservations}
    />
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
  day: PropTypes.string.isRequired,
  dayId: PropTypes.number.isRequired
};
