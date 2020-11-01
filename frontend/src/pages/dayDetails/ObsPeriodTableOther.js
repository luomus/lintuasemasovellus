import React, { useState } from "react";
import { Table, TableHead, TableRow,
  TableBody, TableCell, withStyles, makeStyles
} from "@material-ui/core";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import ObservationPeriod from "../obsPeriod";


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

  console.log("obsperiodtable obsperiods", obsPeriods);

  const [modalOpen, setModalOpen] = useState(false);

  const [obsPeriod, setObsPeriod] = useState("");

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
              <TableRow hover component={Link} onClick={() => handleOpen(s)} key={i} >
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
        obsPeriod={obsPeriod}
        open={modalOpen}
        handleClose={handleClose}
        handleErrorSnackOpe_n={handleErrorSnackOpen}
      />



    </Table>
  );
};

ObsPeriodTableOther.propTypes = {
  obsPeriods: PropTypes.array.isRequired
};

export default ObsPeriodTableOther;