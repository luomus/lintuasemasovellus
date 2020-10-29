import React, { useState } from "react";
import { Table, TableHead, TableRow,
  TableBody, TableCell, withStyles, makeStyles, Snackbar
} from "@material-ui/core";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import ObservationPeriod from "../obsPeriod";
import Alert from "@material-ui/lab/Alert";


const ObsPeriodTable = (props) => {

  const { obsPeriods } = props;

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

  const formatTime = (time) => {
    const ret = time.split(" ")[4].split(":");
    // hours 0 and minutes 1
    return `${ret[0]}:${ret[1]}`;
  };

  console.log("obsperiodtable obsperiods", obsPeriods);

  const [modalOpen, setModalOpen] = useState(false);

  const [obsPeriod, setObsPeriod] = useState("");


  const handleOpen = (obsPeriod) => {
    console.log("handleOpen obsPeriod:", obsPeriod);
    setObsPeriod(obsPeriod);
    setModalOpen(true);
    
  };

  const [formSent, setFormSent] = useState(false);
  const [errorHappen, setErrorHappen] = useState(false);

  const handleClose = () => {
    setModalOpen(false);
    setFormSent(true);
  };



  const handleSnackClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setFormSent(false);
    setErrorHappen(false);
  };

  const handleErrorSnackOpen = () => {
    setErrorHappen(true);
  };


  return (
    <Table className={classes.table}>
      <TableHead>
        <TableRow>
          <StyledTableCell>{t("location")}</StyledTableCell>
          <StyledTableCell align="right">{t("startTime")}</StyledTableCell>
          <StyledTableCell align="right">{t("endTime")}</StyledTableCell>
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
  );
};

ObsPeriodTable.propTypes = {
  obsPeriods: PropTypes.array.isRequired
};

export default ObsPeriodTable;