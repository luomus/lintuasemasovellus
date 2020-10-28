import React, { useState } from "react";
import { Table, TableHead, TableRow,
  TableBody, TableCell, withStyles, makeStyles, Snackbar
} from "@material-ui/core";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import ObservationPeriod from "../obsPeriod";
import Alert from "@material-ui/lab/Alert";


const ObsPeriodTableOther = (props) => {

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

  const [obsPeriodId, setObsPeriodId] = useState("");

  const handleOpen = (id) => {
    console.log("handleOpen id:", id);
    setObsPeriodId(id);
    setModalOpen(true);
  };

  const [formSent, setFormSent] = useState(false);
  const [errorHappen, setErrorHappen] = useState(false);

  const handleClose = () => {
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
          <StyledTableCell align="right">{t("type")}</StyledTableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {
          obsPeriods
            .map((s, i) =>
              <TableRow hover component={Link} onClick={() => handleOpen(s.id)} key={i} >
                <StyledTableCell component="th" scope="row">
                  {s.location}
                </StyledTableCell>
                
                <StyledTableCell align="right">
                  {s.observationType}
                </StyledTableCell>
              </TableRow>
            )
        }
      </TableBody>
      <ObservationPeriod
        obsPeriodId={obsPeriodId}
        open={modalOpen}
        handleClose={handleClose}
        handleErrorSnackOpe_n={handleErrorSnackOpen}
      />

      <Snackbar open={formSent} autoHideDuration={5000} onClose={handleSnackClose}>
        <Alert onClose={handleSnackClose} severity="success">
          {t("periodSaved")}
        </Alert>
      </Snackbar>
      <Snackbar open={errorHappen} autoHideDuration={5000} onClose={handleSnackClose}>
        <Alert onClose={handleSnackClose} severity="error">
          {t("periodNotSaved")}
        </Alert>
      </Snackbar>
    </Table>
  );
};

ObsPeriodTableOther.propTypes = {
  obsPeriods: PropTypes.array.isRequired
};

export default ObsPeriodTableOther;