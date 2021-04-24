import {
  Paper, withStyles, makeStyles, Table, TableBody,
  TableCell, TableHead, TableRow,
  TableContainer,
  Typography
} from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { Link, Redirect, useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { retrieveDays } from "../../reducers/daysReducer";
import DayPagination from "./DayPagination";

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

const StyledTableCell = withStyles(() => ({
  head: {
    backgroundColor: "grey",
    color: "white",
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

export const DayList = () => {

  const user = useSelector(state => state.user);
  const userIsSet = Boolean(user.id);

  const { t } = useTranslation();

  const history = useHistory();

  const classes = useStyles();

  const userObservatory = useSelector(state => state.userObservatory);

  const list = useSelector(state => state.days.filter((day) => day.observatory === userObservatory));

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(retrieveDays());
  }, [dispatch]);

  if (!list) return null;

  if (!userIsSet) {
    return (
      <Redirect to="/login" />
    );
  }

  const comparator = (a, b) => {
    const day1 = a.day.split(".");
    const day2 = b.day.split(".");
    const num1 = day1[2] + day1[1] + day1[0];
    const num2 = day2[2] + day2[1] + day2[0];
    return Number(num1) < Number(num2)
      ? 1
      : Number(num1) > Number(num2)
        ? -1 : 0;
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

  const handleDateClick = (s) => {
    history.push(`/daydetails/${s.day}/${userObservatory}`);
  };

  return (
    <div>
      <Paper className={classes.paper}>

        <Typography variant="h5" component="h2" >
          {t("days")}
        </Typography>
        <br />
        <TableContainer>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <StyledTableCell>{t("date")}</StyledTableCell>
                <StyledTableCell align="right">{t("observers")}</StyledTableCell>
                <StyledTableCell align="right">{t("comment")}</StyledTableCell>
                <StyledTableCell align="right">{t("observationStation")}</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                list
                  .sort(comparator)
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((s, i) =>
                    <TableRow id="dayTableRow" hover key={i}
                      onClick={() => handleDateClick(s)} className={classes.linkImitator} >
                      <StyledTableCell component="th" scope="row">
                        <Link style={{ color: "black" }} to={`/daydetails/${s.day}`}>
                          {s.day}
                        </Link>
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        <Link style={{ color: "black" }} to={`/daydetails/${s.day}`}>
                          {s.observers}
                        </Link>
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        <Link style={{ color: "black" }} to={`/daydetails/${s.day}`}>
                          {s.comment}
                        </Link>
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        <Link style={{ color: "black" }} to={`/daydetails/${s.day}`}>
                          {s.observatory.replace("_", " ")}
                        </Link>
                      </StyledTableCell>
                    </TableRow>
                  )
              }
            </TableBody>
            <DayPagination list={list} rowsPerPage={rowsPerPage}
              handleChangePage={handleChangePage}
              handleChangeRowsPerPage={handleChangeRowsPerPage}
              page={page}
            />
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
};