import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  Table, TableHead, TableRow, TableContainer,
  TableBody, Typography,
  FormControlLabel, Checkbox, Grid
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import PeriodTablePagination from "./PeriodTablePagination";
import SpeciesTableRow from "./SpeciesTableRow";
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

  const { day, summary, defaultSpecies } = props;

  const { t } = useTranslation();
  const classes = useStyles();
  const { speciesData } = useContext(AppContext);

  const [birdsWithObsFilter, setBirdsWithObsFilter] = useState(false);
  const [textFilter, setTextFilter] = useState("");

  const [summaryWithLatestChanges, setSummaryWithLatestChanges] = useState(summary);
  const [filteredSummary, setFilteredSummary] = useState([]);
  const [rows, setRows] = useState([]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(-1);

  const handleChangePage = useCallback((event, newPage) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback((event) => {
    setRowsPerPage(Number(event.target.value));
    setPage(0);
  }, []);

  useEffect(() => {
    setSummaryWithLatestChanges(generateExtendedSummary(summary, defaultSpecies));
  }, [summary, defaultSpecies]);

  useEffect(() => {
    setPage(0);
  }, [filteredSummary]);

  const generateExtendedSummary = (summary, species) => {
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
              constMigration: 0,
              nightMigration: 0,
              otherMigration: 0,
              localGåu: 0,
              localOther: 0,
              scatter: 0,
              localGåuShorthand: "", // At least this one is Hanko specific
              localOtherShorthand: "",
              notes: "",
              scatterShorthand: "",
              species: current
            })
        );
      }, []
      )
    );
  };

  const handleFilterChange = useCallback((event) => {
    setBirdsWithObsFilter(event.target.checked);
  }, []);

  useEffect(() => {
    setFilteredSummary(
      [...summaryWithLatestChanges]
        .filter(s =>
          (birdsWithObsFilter ? getTotalCount(s) > 0 : true)
          && s.species.toLowerCase().includes(textFilter.toLowerCase())
        )
    );
  }, [summaryWithLatestChanges, birdsWithObsFilter, textFilter]);

  useEffect(() => {
    const newRows = rowsPerPage === -1
      ? filteredSummary
      : filteredSummary.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    setRows(newRows);
  }, [filteredSummary, page, rowsPerPage]);

  const onRowChange = useCallback((row) => {
    setSummaryWithLatestChanges((prevState) => (
      prevState.map(obj => {
        if (obj.species === row.species) {
          return row;
        }
        return obj;
      })
    ));
  }, []);

  const getTotalCount = (s) => {
    return s.constMigration +
      s.nightMigration +
      s.otherMigration +
      s.localGåu +
      s.localOther +
      s.scatter;
  };

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
            {rows
              .map((s) =>
                <StyledTableRow hover key={s.species}>
                  <SpeciesTableRow day={day} s={s} key={s.species} onChange={onRowChange} />
                </StyledTableRow>
              )
            }
          </TableBody>
        </Table>
      </TableContainer>
      <PeriodTablePagination
        totalCount={filteredSummary.length}
        rowsPerPage={rowsPerPage}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        page={page}
      />
    </div>
  );
};

SpeciesTable.propTypes = {
  day: PropTypes.string.isRequired,
  summary: PropTypes.array.isRequired,
  defaultSpecies: PropTypes.array.isRequired
};

export default SpeciesTable;
