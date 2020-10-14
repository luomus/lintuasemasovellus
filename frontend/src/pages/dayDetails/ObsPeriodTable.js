import React from "react";
import { Table, TableHead, TableRow,
  TableBody, TableCell, withStyles, makeStyles
} from "@material-ui/core";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";


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

  return (
    <Table className={classes.table}>
      <TableHead>
        <TableRow>
          <StyledTableCell>{t("location")}</StyledTableCell>
          <StyledTableCell align="right">{t("startTime")}</StyledTableCell>
          <StyledTableCell align="right">{t("endTime")}</StyledTableCell>
          <StyledTableCell align="right">{t("type")}</StyledTableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {
          obsPeriods
            .map((s, i) =>
              <TableRow hover key={i}>
                <StyledTableCell component="th" scope="row">
                  {s.location}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {formatTime (s.startTime)}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {formatTime(s.endTime)}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {s.observationType}
                </StyledTableCell>
              </TableRow>
            )
        }
      </TableBody>
    </Table>
  );
};

ObsPeriodTable.propTypes = {
  obsPeriods: PropTypes.array.isRequired
};

export default ObsPeriodTable;