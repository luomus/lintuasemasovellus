import {
  Paper, withStyles, makeStyles, Table, TableBody,
  TableCell, TableHead, TableRow,
  Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ObsStation from "../../globalComponents/ObsStation";
import { getDays } from "../../services";
import DayPagination from "./DayPagination";
import { useTranslation } from "react-i18next";


const useStyles = makeStyles({
  paper: {
    background: "white",
    padding: "20px 30px",
    margin: "0px 0px 50px 0px",
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

  const { t } = useTranslation();

  const [list, setList] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    getDays()
      .then(daysJson => setList(daysJson));
  }, []);


  console.log(list);

  if (!list) return null;

  return (
    <div>
      <Paper className={classes.paper}>

        <Typography variant="h5" component="h2" >
        {t("days")}
        </Typography>
        <br />
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
                .sort((a, b) => a.day - b.day)
                .map((s, i) =>
                  <TableRow hover key={i}>
                    <StyledTableCell component="th" scope="row">
                      <Link to={`/paivatiedot/${s.day}`}>
                        {s.day}
                      </Link>
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {s.observers}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {s.comment}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      <ObsStation id={s.observatory} />
                    </StyledTableCell>
                  </TableRow>
                )
            }
          </TableBody>
          <DayPagination listSize={list.length} />
        </Table>
      </Paper>
    </div>
  );
};
