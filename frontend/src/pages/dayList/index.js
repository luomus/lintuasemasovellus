import {
  Checkbox,
  Chip,
  ListItemText,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";
import { refreshDays } from "../../reducers/daysReducer";
import DayPagination from "./DayPagination";
import parse from "date-fns/parse";
import LoadingSpinner from "../../globalComponents/LoadingSpinner";
import { StyledTableCell } from "../../globalComponents/common";
import { AppContext } from "../../AppContext";

const useStyles = makeStyles({
  paper: {
    background: "white",
    padding: "20px 30px"
  },
  linkImitator: {
    cursor: "pointer",
    textDecoration: "underline",
    color: "black",
  },
  formControl: {
    margin: "2px",
    minWidth: 120,
    maxWidth: 300,
  },
  chips: {
    display: "flex",
    flexWrap: "wrap",
  },
  chip: {
    margin: 2,
  },
});

const getSelectList = (observatory) => createSelector(
  [state => state.days],
  (days) => (
    days?.filter((day) => day.observatory === observatory)
  )
);

export const DayList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const classes = useStyles();
  const dispatch = useDispatch();
  const { observatory } = useContext(AppContext);

  const list = useSelector(getSelectList(observatory));

  const [selectedYears, setSelectedYears] = useState([]);
  const [availableYears, setAvailableYears] = useState([]);

  useEffect(() => {
    dispatch(refreshDays());
  }, []);

  useEffect(() => {
    if (!list) {
      return;
    }

    if(availableYears.length < 1)
      setAvailableYears([...new Set(list.map(i => parse(i.day, "dd.MM.yyyy", new Date()).getFullYear()))].sort());
  }, [list]);

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
    navigate(`/daydetails/${s.day}`);
  };

  if (!list) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <Paper className={classes.paper}>

        <Typography variant="h4" component="h2" >
          {t("days")}
        </Typography>
        <br/>
        <Typography variant="subtitle1">
          {t("filter")}
        </Typography>
        <TextField
          className={classes.formControl}
          label={t("year")}
          id="filter-year"
          select
          slotProps={{
            select: {
              multiple: true,
              value: selectedYears,
              onChange: (e) => setSelectedYears(e.target.value),
              renderValue: (selected) => (
                <div className={classes.chips}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} className={classes.chip}/>
                  ))}
                </div>
              )
            }
          }}
        >
          {availableYears.map((y) => (
            <MenuItem key={y} value={y}>
              <Checkbox checked={selectedYears.indexOf(y) > -1} />
              <ListItemText primary={y} />
            </MenuItem>
          ))}
        </TextField>
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
                  .filter(el => selectedYears.includes(parse(el.day, "dd.MM.yyyy", new Date()).getFullYear()) || selectedYears.length === 0)
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
            <DayPagination totalCount={list.length} rowsPerPage={rowsPerPage}
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
