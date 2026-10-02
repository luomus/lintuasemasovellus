import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  Alert, Box, Grid
} from "@mui/material";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import AntTabs from "./AntTabs";

import {
  getDefaultSpecies,
  getSummary
} from "../../../services";
import ShorthandEdit from "./ShorthandEdit";
import SpeciesTable from "./SpeciesTable";
import PeriodTable from "./PeriodTable";
import { AppContext } from "../../../AppContext";
import LoadingSpinner from "../../../globalComponents/LoadingSpinner";

const emptyArray = [];

export const ObservationEdit = ({ day, dayId, refreshObservations }) => {
  const { t } = useTranslation();
  const { observatory, speciesData } = useContext(AppContext);

  const obsPeriods = useSelector(state => state.dayData.data?.observationPeriods || emptyArray);

  const [defaultSpecies, setDefaultSpecies] = useState([]);
  const [addableSpecies, setAddableSpecies] = useState([]);
  const [speciesSummary, setSpeciesSummary] = useState([]);
  const [speciesRows, setSpeciesRows] = useState([]);

  const [mode, setMode] = useState("speciesTable");
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      setLoading(true);
      setFetchError(false);

      try {
        const [defaultSpeciesJson, summary] = await Promise.all([
          getDefaultSpecies(observatory),
          getSummary(dayId),
        ]);
        if (cancelled) {
          return;
        }
        setDefaultSpecies(defaultSpeciesJson);
        setSpeciesSummary(summary);
      } catch (e) {
        if (cancelled) {
          return;
        }
        console.error(e);
        setFetchError(true);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [observatory, dayId]);

  useEffect(() => {
    updateSpeciesRows(speciesSummary, defaultSpecies);
  }, [speciesSummary, defaultSpecies]);

  useEffect(() => {
    setAddableSpecies(speciesData.uniqueSpecies.filter(species => !defaultSpecies.includes(species)));
  }, [speciesData, defaultSpecies]);

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
      obsPeriods={obsPeriods}
      onEditSuccess={refreshObservations}
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
        <ShorthandEdit day={day} dayId={dayId} onEditSuccess={refreshObservations}></ShorthandEdit>
      </Grid>
      <Grid item xs={12}>
        {loading ? (
          <LoadingSpinner size="small" />
        ) : fetchError ? (
          <Alert severity="error">
            {t("dayObservationsFetchFailed")}
          </Alert>
        ) : table}
      </Grid>
    </Grid>
  );
};

ObservationEdit.propTypes = {
  day: PropTypes.string.isRequired,
  dayId: PropTypes.number.isRequired,
  refreshObservations: PropTypes.func.isRequired,
};
