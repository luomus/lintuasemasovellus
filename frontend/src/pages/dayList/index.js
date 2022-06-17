import {
  Paper, withStyles, makeStyles, Table, TableBody,
  TableCell, TableHead, TableRow,
  TableContainer,
  Typography,
  FormControl,
  InputLabel,
  Select,
  Input,
  MenuItem,
  Checkbox,
  ListItemText,
  Chip
} from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { retrieveDays } from "../../reducers/daysReducer";
import DayPagination from "./DayPagination";
import parse from "date-fns/parse";

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

const StyledTableCell = withStyles(() => ({
  head: {
    backgroundColor: "grey",
    color: "white",
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

export const DayList = ({ userObservatory }) => {

  const { t } = useTranslation();

  const history = useHistory();

  const classes = useStyles();

  const list = useSelector(state => state.days.filter((day) => day.observatory === userObservatory));

  console.log("list: ", list);

  const dispatch = useDispatch();

  const [selectedYears, setSelectedYears] = useState([]);
  const [availableYears, setAvailableYears] = useState([]);

  useEffect(() => {
    if(availableYears.length < 1)
      setAvailableYears([...new Set(list.map(i => parse(i.day, "dd.MM.yyyy", new Date()).getFullYear()))].sort());
  }, [list]);

  useEffect(() => {
    dispatch(retrieveDays());
  }, [dispatch]);

  if (!list) return null;

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
    history.push(`/daydetails/${s.day}`);
  };

  console.log("list: ", list);

  return (
    <div>
      <Paper className={classes.paper}>

        <Typography variant="h5" component="h2" >
          {t("days")}
        </Typography>
        <br />
        {t("filter")}
        <br />
        <FormControl className={classes.formControl}>
          <InputLabel id="filter-year-label">{t("year")}</InputLabel>
          <Select
            labelId="filter-year-label"
            id="filter-year"
            multiple
            input={<Input />}
            value={selectedYears}
            onChange={(e) => setSelectedYears(e.target.value)}
            renderValue={(selected) => (
              <div className={classes.chips}>
                {selected.map((value) => (
                  <Chip key={value} label={value} className={classes.chip} />
                ))}
              </div>
            )}
          >
            {availableYears.map((y) => (
              <MenuItem key={y} value={y}>
                <Checkbox checked={selectedYears.indexOf(y) > -1} />
                <ListItemText primary={y} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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

DayList.propTypes = {
  userObservatory: PropTypes.string.isRequired
};