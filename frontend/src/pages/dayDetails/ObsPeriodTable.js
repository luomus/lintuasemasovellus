import React, { useState } from "react";
import {
  Table, TableHead, TableRow, TableContainer,
  TableBody, TableCell, withStyles, makeStyles, Typography,
  IconButton
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import ObservationPeriod from "../obsPeriod";
import EditObsPeriod from "../editObsPeriod";
import PeriodTablePagination from "./PeriodTablePagination";

const ObsPeriodTable = (props) => {

  const { date, obsPeriods, summary, mode } = props;

  const { t } = useTranslation();

  const useStyles = makeStyles({
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
  });

  const classes = useStyles();

  const StyledTableCell = withStyles(() => ({
    head: {
      backgroundColor: "grey",
      color: "white",
    },
    body: {
      fontSize: 14,
    },
  }))(TableCell);

  const [modalOpen, setModalOpen] = useState(false);

  const [editModalOpen, setEditModalOpen] = useState(false);

  const [obsPeriod, setObsPeriod] = useState({});

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

  const handleClose = () => {
    setModalOpen(false);
    setEditModalOpen(false);
  };

  const handleErrorSnackOpen = () => {
  };

  if (mode === "table1") {
    return (
      <div>
        <Typography variant="h6" >
          Lajit
        </Typography>
        <TableContainer>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <StyledTableCell >{t("species")}</StyledTableCell>
                <StyledTableCell align="right">{t("totalCount")}</StyledTableCell>
                <StyledTableCell align="right">{t("constantMigration")}</StyledTableCell>
                <StyledTableCell align="right">{t("otherMigration")}</StyledTableCell>
                <StyledTableCell align="right">{t("nightMigration")}</StyledTableCell>
                <StyledTableCell align="right">{t("scatteredMigration")}</StyledTableCell>
                <StyledTableCell align="right">{t("localTotal")}</StyledTableCell>
                <StyledTableCell align="right">{t("localCount")}</StyledTableCell>
                <StyledTableCell align="right">{t("localGau")}</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                summary
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((s, i) =>
                    <TableRow hover key={i}>
                      <StyledTableCell component="th" scope="row">
                        {s.species}
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
                    </TableRow>
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
        <PeriodTablePagination list={summary} rowsPerPage={rowsPerPage}
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
        Jaksot
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
              <StyledTableCell align="right">{t("Modify")}</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              obsPeriods
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((s, i) =>
                  <TableRow hover key={i} >
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
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </StyledTableCell>
                  </TableRow>
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
  mode: PropTypes.string.isRequired
};

export default ObsPeriodTable;