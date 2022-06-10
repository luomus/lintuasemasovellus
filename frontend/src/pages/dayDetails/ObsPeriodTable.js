import React, { useEffect, useState } from "react";
import {
  Table, TableHead, TableRow, TableContainer,
  TableBody, TableCell, withStyles, makeStyles, Typography,
  IconButton, FormControlLabel, Checkbox, TextField, Grid
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import ObservationPeriod from "../obsPeriod";
import EditObsPeriod from "../editObsPeriod";
import PeriodTablePagination from "./PeriodTablePagination";
import globals from "../../globalConstants";

const ObsPeriodTable = (props) => {

  const { date, obsPeriods, summary, mode, refetchObservations } = props;

  const { t } = useTranslation();

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

  const classes = useStyles();

  const StyledTableCell = withStyles(() => ({
    head: {
      backgroundColor: "grey",
      color: "white",
    },
    body: {
      fontSize: 14,
      "&:nth-child(1) summary": {
        cursor: "pointer",
      },
      "&.dotted": {
        borderLeft: "1px dotted",
      }
    },
  }))(TableCell);

  const StyledTableRow = withStyles(() => ({
    root: {
      "&:nth-child(even)": {
        background: "#70cfff3d",
        "&:hover": {
          background: "#67cafd80",
        },
      },
    },
  }))(TableRow);

  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [obsPeriod, setObsPeriod] = useState({});
  const [onlyBirdsWithObservations, setOnlyBirdsWithObservations] = useState(true);
  const [textFilter, setTextFilter] = useState("");
  const [filteredSummary, setFilteredSummary] = useState(summary);
  const [summaryWithAll, setSummaryWithAll] = useState(summary);

  const timeDifference = (time1, time2) => {
    const startTime = time1.split(":");
    const endTime = time2.split(":");
    const dateST = new Date(0, 0, 0, startTime[0], startTime[1]);
    const dateET = new Date(0, 0, 0, endTime[0], endTime[1]);
    const diff = dateET.getTime() - dateST.getTime();
    return diff;
  };

  const msToTime = (ms) => {
    var s = ms / 1000;
    var mins = s / 60;
    var hrs = Math.floor(mins / 60);
    var mins2 = mins % 60;
    return hrs + "h " + mins2 + "min";
  };

  const handleOpen = (obsPeriod) => {
    setObsPeriod(obsPeriod);
    setModalOpen(true);
    setEditModalOpen(false);
  };

  const handleOpenEdit = (obsPeriod) => {
    setObsPeriod(obsPeriod);
    setModalOpen(false);
    setEditModalOpen(true);
  };

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(Number(event.target.value));
    setPage(0);
  };

  useEffect(() => {
    setPage(0);
  }, [filteredSummary]);

  const handleClose = () => {
    setModalOpen(false);
    if (editModalOpen) {
      refetchObservations();
      setEditModalOpen(false);
    }
  };

  const handleErrorSnackOpen = () => {
  };

  const addSpeciesToSummary = () => {
    setSummaryWithAll(
      globals.uniqueBirds.reduce(
        (previous, current) => {
          const birdInSummary = summary.find(bird => bird.species === current);
          if (birdInSummary) {
            return previous.concat(birdInSummary);
          }
          return (
            previous
              .concat({
                /* Notice that these are specific to Hangon_Lintuasema.
                   These are hard coded to table rows. These attributes should
                   be defined elsewhere in case full support for additional
                   observatories is about to be implemented. */
                allMigration: 0,
                constMigration: 0,
                localGåu: 0,
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
      ).sort((a, b) => a.species.localeCompare(b.species))
    );
  };

  const handleFilterChange = () => {
    setOnlyBirdsWithObservations(!onlyBirdsWithObservations);
  };

  const handleTextFilterChange = (event) => {
    setTextFilter(event.target.value);
  };

  useEffect(() => {
    addSpeciesToSummary();
  }, [summary]);

  useEffect(() => {
    filterSummary();
  }, [textFilter, onlyBirdsWithObservations, summaryWithAll]);

  const filterSummary = () => {
    setFilteredSummary(
      [...summaryWithAll]
        .filter(s =>
          (s.allMigration + s.totalLocal) > (onlyBirdsWithObservations ? 0 : -1)
          && s.species.toLowerCase().includes(textFilter.toLowerCase())));
  };

  if (mode === "speciesTable") {
    return (
      <div>
        <Typography variant="h6" >
          {t("summary")}
        </Typography>
        <Grid container
          spacing={2}
          alignItems="flex-end"
          className={classes.filterContainer}
        >
          <Grid item>
            <TextField
              rows={1}
              multiline={false}
              id="textFilter"
              fullWidth={false}
              label={t("speciesTextFilter")}
              onChange={handleTextFilterChange}
              value={textFilter}
            />
          </Grid>
          <Grid item>
            <FormControlLabel
              control={
                <Checkbox
                  checked={onlyBirdsWithObservations}
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
        <TableContainer>
          <Table className={classes.table} id="speciesTable">
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
                .map((s, i) =>
                  <StyledTableRow hover key={i}>
                    <StyledTableCell component="th" scope="row">
                      {s.notes ?
                        <details>
                          <summary>{s.species}</summary>
                          <p> {s.notes} </p>
                        </details>
                        : <>{s.species}</>}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {s.allMigration}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {s.constMigration}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {s.otherMigration}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {s.nightMigration}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {s.scatterObs}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {s.totalLocal}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {s.localOther}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {s.localGåu}
                    </StyledTableCell>
                  </StyledTableRow>
                )
              }
            </TableBody>
            <ObservationPeriod
              obsPeriod={obsPeriod}
              open={modalOpen}
              handleClose={handleClose}
              handleErrorSnackOpen={handleErrorSnackOpen}
            />
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
  }

  return (

    <div>
      <Typography variant="h6" >
        {t("obsPeriods")}
      </Typography>
      <TableContainer>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <StyledTableCell>{t("location")}</StyledTableCell>
              <StyledTableCell align="right">{t("startTime")}</StyledTableCell>
              <StyledTableCell align="right">{t("endTime")}</StyledTableCell>
              <StyledTableCell align="right">{t("duration")}</StyledTableCell>
              <StyledTableCell align="right">{t("type")}</StyledTableCell>
              <StyledTableCell align="right">{t("speciesTotal")}</StyledTableCell>
              <StyledTableCell align="right">{t("modify")}</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              obsPeriods
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((s, i) =>
                  <StyledTableRow hover key={i} >
                    <StyledTableCell component="th" scope="row" className={classes.linkImitator} onClick={() => handleOpen(s)}>
                      {s.location}
                    </StyledTableCell>
                    <StyledTableCell align="right" className={classes.linkImitator} onClick={() => handleOpen(s)}>
                      {s.startTime}
                    </StyledTableCell>
                    <StyledTableCell align="right" className={classes.linkImitator} onClick={() => handleOpen(s)}>
                      {s.endTime}
                    </StyledTableCell>
                    <StyledTableCell align="right" className={classes.linkImitator} onClick={() => handleOpen(s)}>
                      {msToTime(timeDifference(s.startTime, s.endTime))}
                    </StyledTableCell>
                    <StyledTableCell align="right" className={classes.linkImitator} onClick={() => handleOpen(s)}>
                      {s.observationType}
                    </StyledTableCell>
                    <StyledTableCell align="right" className={classes.linkImitator} onClick={() => handleOpen(s)}>
                      {s.speciesCount}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      <IconButton size="small" variant="contained" color="primary" onClick={() => handleOpenEdit(s)}>
                        <EditIcon fontSize="small" id="editObsPeriod" />
                      </IconButton>
                    </StyledTableCell>
                  </StyledTableRow>
                )
            }
          </TableBody>
          <ObservationPeriod
            obsPeriod={obsPeriod}
            open={modalOpen}
            handleClose={handleClose}
            handleErrorSnackOpen={handleErrorSnackOpen}
          />
          <EditObsPeriod
            date={date}
            obsPeriod={obsPeriod}
            open={editModalOpen}
            handleClose={handleClose}
          />
        </Table>
      </TableContainer>
      <PeriodTablePagination list={obsPeriods} rowsPerPage={rowsPerPage}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        page={page}
      />
    </div>
  );
};

ObsPeriodTable.propTypes = {
  date: PropTypes.string.isRequired,
  obsPeriods: PropTypes.array.isRequired,
  summary: PropTypes.array.isRequired,
  mode: PropTypes.string.isRequired,
  refetchObservations: PropTypes.func.isRequired
};

export default ObsPeriodTable;