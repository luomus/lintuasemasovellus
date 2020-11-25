import React, { useState } from "react";
import {
  Table, TableHead, TableRow,
  TableBody, TableCell, withStyles, makeStyles, Typography
} from "@material-ui/core";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import ObservationPeriod from "../obsPeriod";


const ObsPeriodTable = (props) => {

  const { obsPeriods, summary, mode } = props;

  const { t } = useTranslation();

  const useStyles = makeStyles({
    paper: {
      background: "white",
      padding: "20px 30px",
      margin: "0px 0px 50px 0px",
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



  console.log("obsperiodtable obsperiods", obsPeriods);
  console.log("summary", summary);
  console.log("mode: " + mode);

  const [modalOpen, setModalOpen] = useState(false);

  const [obsPeriod, setObsPeriod] = useState({});

  const timeDifference = (time1, time2) => {
    const ret = Date.parse(time1) - Date.parse(time2);
    return ret;
  };

  const msToTime = (ms) => {
    var s = ms / 1000;
    var mins = s / 60;
    var hrs = Math.floor(mins / 60);
    var mins2 = mins % 60;
    return hrs + "h " + mins2 + "min";
  };

  const formatTime = (time) => {
    const ret = time.split(" ")[1].split(":");
    return `${ret[0]}:${ret[1]}`;
  };

  const handleOpen = (obsPeriod) => {
    console.log("handleOpen obsPeriod:", obsPeriod);
    setObsPeriod(obsPeriod);
    setModalOpen(true);

  };


  const handleClose = () => {
    setModalOpen(false);
  };

  const handleErrorSnackOpen = () => {
  };

  if (mode === "table1") {
    return (
      <div>
        <Typography variant="h6" >
          Lajit
        </Typography>

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
      </div>
    );
  }

  return (

    <div>
      <Typography variant="h6" >
        Jaksot
      </Typography>

      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <StyledTableCell>{t("location")}</StyledTableCell>
            <StyledTableCell align="right">{t("startTime")}</StyledTableCell>
            <StyledTableCell align="right">{t("endTime")}</StyledTableCell>
            <StyledTableCell align="right">{t("duration")}</StyledTableCell>
            <StyledTableCell align="right">{t("type")}</StyledTableCell>
            <StyledTableCell align="right">{t("speciesTotal")}</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            obsPeriods
              .map((s, i) =>
                <TableRow hover component={Link} onClick={() => handleOpen(s)} key={i} >
                  <StyledTableCell component="th" scope="row">
                    {s.location}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {formatTime(s.startTime)}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {formatTime(s.endTime)}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {msToTime(timeDifference(s.endTime, s.startTime))}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {s.observationType}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {s.speciesCount}
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
    </div>
  );
};

ObsPeriodTable.propTypes = {
  obsPeriods: PropTypes.array.isRequired,
  summary: PropTypes.array.isRequired,
  mode: PropTypes.string.isRequired
};

export default ObsPeriodTable;