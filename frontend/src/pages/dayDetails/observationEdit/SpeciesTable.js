import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  Table, TableHead, TableRow, TableContainer,
  TableBody, Typography,
  FormControlLabel, Checkbox, Grid,
  MenuItem, TextField
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import PeriodTablePagination from "./PeriodTablePagination";
import Row from "./Row";
import SearchBar from "../../../globalComponents/SearchBar";
import { StyledTableCell, StyledTableRow } from "../../../globalComponents/common";
import { AppContext } from "../../../AppContext";

const useStyles = makeStyles((theme) => ({
  paper: {
    background: "white",
    padding: "20px 30px",
    margin: "0px 0px 50px 0px",
  },
  linkImitator: {
    cursor: "pointer",
    textDecoration: "underline",
    color: "black",
  },
  checkbox: {
    color: theme.palette.primary.main
  },
  filterContainer: {
    marginBottom: "5px",
    justifyContent: "flex-start"
  },
}));

const SpeciesTable = (props) => {

  const { date, summary, defaultSpecies } = props;

  const { t } = useTranslation();
  const classes = useStyles();
  const { speciesData } = useContext(AppContext);

  const [birdsWithObsFilter, setBirdsWithObsFilter] = useState(false);
  const [textFilter, setTextFilter] = useState("");
  const [speciesListType, setSpeciesListType] = useState("defaults");
  const [filteredSummary, setFilteredSummary] = useState(summary);
  const [extendedSummary, setExtendedSummary] = useState(summary);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);

  const handleChangePage = useCallback((event, newPage) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback((event) => {
    setRowsPerPage(Number(event.target.value));
    setPage(0);
  }, []);

  useEffect(() => {
    setPage(0);
  }, [filteredSummary]);

  const generateExtendedSummary = (species) => {
    return (
      species.reduce((previous, current) => {
        //Use observation data if exists
        const birdInSummary = summary.find(bird => bird.species === current);
        if (birdInSummary) {
          return previous.concat(birdInSummary);
        }
        //Otherwise add empty row
        return (
          previous
            .concat({
              allMigration: 0,
              constMigration: 0,
              localGåu: 0, //At least this one is Hanko specific
              localOther: 0,
              nightMigration: 0,
              notes: "",
              otherMigration: 0,
              scatterObs: 0,
              species: current,
              totalLocal: 0
            })
        );
      }, []
      )
    );
  };

  const handleFilterChange = useCallback((event) => {
    setBirdsWithObsFilter(event.target.checked);
  }, []);

  const handleSpeciesListChange = useCallback((event) => {
    setSpeciesListType(event.target.value);
  }, []);

  //updateExtendedSummary if changes to summary or speciesListType filter
  useEffect(() => {
    let species;
    switch (speciesListType) {
      case "defaults":
        species = defaultSpecies;
        break;
      case "others":
        species = speciesData.uniqueSpecies.filter(bird => !defaultSpecies.includes(bird));
        break;
      case "all":
        species = speciesData.uniqueSpecies;
        break;
    }
    setExtendedSummary(
      generateExtendedSummary(species)
    );
  }, [summary, speciesListType, defaultSpecies]);

  useEffect(() => {
    setFilteredSummary(
      [...extendedSummary]
        .filter(s =>
          (s.allMigration + s.totalLocal) > (birdsWithObsFilter ? 0 : -1)
          && s.species.toLowerCase().includes(textFilter.toLowerCase())
        )
    );
  }, [extendedSummary, birdsWithObsFilter, textFilter]);

  return (
    <div>
      <Typography variant="h6" >
        {t("summary")}
      </Typography>
      <Grid container
        spacing={3}
        alignItems="flex-end"
        className={classes.filterContainer}
      >
        <Grid item xs={2}>
          <SearchBar
            setTextFilter={setTextFilter}
            defaultValue={textFilter}
          />
        </Grid>
        <Grid item xs={2}>
          <TextField
            fullWidth
            select
            label={t("shownSpecies")}
            id="select-species-list"
            slotProps={{
              select: {
                value: speciesListType,
                onChange: handleSpeciesListChange,
              }
            }}
          >
            <MenuItem value="defaults">{t("observatoryDefaults")}</MenuItem>
            <MenuItem value="others">{t("otherSpecies")}</MenuItem>
            <MenuItem value="all">{t("allSpecies")}</MenuItem>
          </TextField>
        </Grid>
        <Grid item>
          <FormControlLabel
            control={
              <Checkbox
                checked={birdsWithObsFilter}
                onChange={handleFilterChange}
                id="onlyObservationsFilter"
                color="primary"
                className={classes.checkbox}
              />
            }
            label={t("showOnlyBirdsWithObservations")}
            labelPlacement="end"
          />
        </Grid>
      </Grid>
      <TableContainer style={{ maxHeight: "80vh" }}>
        <Table className={classes.table} id="speciesTable" stickyHeader>
          <TableHead>
            <TableRow>
              <StyledTableCell >{t("species")}</StyledTableCell>
              <StyledTableCell align="right">{t("localTotal")}</StyledTableCell>
              <StyledTableCell align="right">{t("localCount")}</StyledTableCell>
              <StyledTableCell align="right">{t("localGau")}</StyledTableCell>
              <StyledTableCell align="right">{t("totalCount")}</StyledTableCell>
              <StyledTableCell align="right">{t("constantMigration")}</StyledTableCell>
              <StyledTableCell align="right">{t("otherMigration")}</StyledTableCell>
              <StyledTableCell align="right">{t("nightMigration")}</StyledTableCell>
              <StyledTableCell align="right">{t("scatteredMigration")}</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredSummary
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((s) =>
                <StyledTableRow hover key={s.species}>
                  <Row s={s} key={s.species} date={date} />
                </StyledTableRow>
              )
            }
          </TableBody>
        </Table>
      </TableContainer>
      <PeriodTablePagination
        list={filteredSummary}
        rowsPerPage={rowsPerPage}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        page={page}
      />
    </div>
  );
};

SpeciesTable.propTypes = {
  date: PropTypes.string.isRequired,
  summary: PropTypes.array.isRequired,
  defaultSpecies: PropTypes.array.isRequired
};

export default SpeciesTable;
