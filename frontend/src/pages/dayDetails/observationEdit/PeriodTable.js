import React, { useCallback, useState } from "react";
import {
  Table, TableHead, TableRow, TableContainer,
  TableBody, Typography,
  IconButton
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import EditIcon from "@mui/icons-material/Edit";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import ObservationPeriod from "../../obsPeriod";
import EditObsPeriod from "../../editObsPeriod";
import PeriodTablePagination from "./PeriodTablePagination";
import { StyledTableCell, StyledTableRow } from "../../../globalComponents/common";

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

const PeriodTable = (props) => {

  const { dayList, date, obsPeriods, refetchObservations } = props;

  const { t } = useTranslation();

  const classes = useStyles();

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
  const [rowsPerPage, setRowsPerPage] = useState(50);

  const handleChangePage = useCallback((event, newPage) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback((event) => {
    setRowsPerPage(Number(event.target.value));
    setPage(0);
  }, []);

  const handleClose = () => {
    setModalOpen(false);
    if (editModalOpen) {
      refetchObservations();
      setEditModalOpen(false);
    }
  };

  const handleErrorSnackOpen = () => {
  };

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
                .filter(i => i.observationType !== "Paikallinen" && i.observationType !== "Hajahavainto")
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
            dayList={dayList}
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

PeriodTable.propTypes = {
  dayList: PropTypes.array,
  date: PropTypes.string.isRequired,
  obsPeriods: PropTypes.array.isRequired,
  refetchObservations: PropTypes.func.isRequired
};

export default PeriodTable;
