import React, { useCallback, useEffect, useState } from "react";
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
import SpeciesSelect from "./SpeciesSelect";

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
  }
}));

const SpeciesTable = (props) => {

  const { day, allRows, addableSpecies, onRowChange, onAddNewSpecies } = props;

  const { t } = useTranslation();
  const classes = useStyles();

  const [textFilter, setTextFilter] = useState("");
  const [birdsWithObsFilter, setBirdsWithObsFilter] = useState(false);

  const [filteredRows, setFilteredRows] = useState([]);
  const [filteredAndPaginatedRows, setFilteredAndPaginatedRows] = useState([]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(-1);

  useEffect(() => {
    setFilteredRows(
      [...allRows]
        .filter(s =>
          (birdsWithObsFilter ? getTotalCount(s) > 0 : true)
          && s.species.toLowerCase().includes(textFilter.toLowerCase())
        )
    );
  }, [allRows, birdsWithObsFilter, textFilter]);

  useEffect(() => {
    const newRows = rowsPerPage === -1
      ? filteredRows
      : filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    setFilteredAndPaginatedRows(newRows);
  }, [filteredRows, page, rowsPerPage]);

  useEffect(() => {
    setPage(0);
  }, [filteredRows]);

  const handleChangePage = useCallback((event, newPage) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback((event) => {
    setRowsPerPage(Number(event.target.value));
    setPage(0);
  }, []);

  const handleFilterChange = useCallback((event) => {
    setBirdsWithObsFilter(event.target.checked);
  }, []);

  const getTotalCount = (s) => {
    return s.constMigration +
      s.nightMigration +
      s.otherMigration +
      s.localGåu +
      s.localOther +
      s.scatter;
  };

  const showAddNewSpeciesRow = rowsPerPage === -1 || page * rowsPerPage + rowsPerPage > filteredRows.length;

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
            {filteredAndPaginatedRows
              .map((s, i) =>
                <StyledTableRow hover key={i}>
                  <SpeciesTableRow index={i} day={day} s={s} key={i} extraSpeciesList={addableSpecies} onChange={onRowChange} />
                </StyledTableRow>
              )
            }
            {showAddNewSpeciesRow &&
              <StyledTableRow hover>
                <StyledTableCell colSpan={9}>
                  <SpeciesSelect speciesList={addableSpecies} onSelect={onAddNewSpecies} />
                </StyledTableCell>
              </StyledTableRow>
            }
          </TableBody>
        </Table>
      </TableContainer>
      <PeriodTablePagination
        totalCount={filteredRows.length + 1}
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
  allRows: PropTypes.array.isRequired,
  addableSpecies: PropTypes.array.isRequired,
  onRowChange: PropTypes.func.isRequired,
  onAddNewSpecies: PropTypes.func.isRequired,
};

export default SpeciesTable;
