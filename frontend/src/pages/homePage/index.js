import React, {
  useEffect,
  useState
} from "react";
import {
  Paper, Grid, Box,
  Typography, TextField, Button,
  FormControl, InputLabel, Select, MenuItem, Snackbar,
  Table, TableRow, TableBody, TableCell, withStyles,
  List, ListItem
} from "@material-ui/core/";
import WarningIcon from "@material-ui/icons/Warning";
import { makeStyles } from "@material-ui/core/styles";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { useTranslation } from "react-i18next";
import ObservatorySelector from "./observatorySelector";
import { useSelector, useDispatch } from "react-redux";
import { Redirect, Link, useHistory } from "react-router-dom";
import Alert from "../../globalComponents/Alert";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/idea.css";
import {
  sendDay,
  loopThroughObservationPeriods,
  loopThroughObservations,
  //sendShorthand,
  //makeSendDataJson,
} from "./parseShorthandField";
import { searchDayInfo, getLatestDays } from "../../services";
import { retrieveDays } from "../../reducers/daysReducer";
import { setDailyActions } from "../../reducers/dailyActionsReducer";
import CodeMirrorBlock from "../../globalComponents/codemirror/CodeMirrorBlock";
import { getErrors } from "../../shorthand/validations";
import DailyActions from "./dailyActions";


const useStyles = makeStyles((theme) => ({
  obsPaper: {
    background: "white",
    padding: "20px 30px",
    margin: "10px 10px 10px 10px",
  },
  infoPaper: {
    background: "white",
    padding: "20px 30px",
    margin: "10px 10px 10px 10px",
    maxHeight: "34vw",
    overflow: "auto",
  },
  errorPaper: {
    background: "#f5f890",
    padding: "20px 30px",
    margin: "10px 10px 10px 10px",
    maxHeight: "11vw",
    overflow: "auto",
  },
  errorHeading: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
  },
  card: {
    background: "white",
    margin: "10px 10px 10px 10px"
  },
  formControl: {
    margin: theme.spacing(0),
    minWidth: 120,
  },
  sendButton: {
    marginBottom: "40px",
    position: "static",
  },
  pointerCursor: {
    cursor: "pointer",
    textDecoration: "underline",
  },
  formControlLabel: {
    padding: "0px 100px 0px 0px",
  },
  attachmentField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 75,
  },
}
));


const StyledTableCell = withStyles(() => ({
  head: {
    backgroundColor: "grey",
    color: "white",
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);


export const HomePage = () => {
  const classes = useStyles();

  const { t } = useTranslation();

  const formatDate = (date) => {
    if (date === null) {
      return;
    }
    const dd = date.getDate();
    const mm = date.getMonth() + 1;
    return `${dd > 9 ? "" : "0"}${dd}.${mm > 9 ? "" : "0"}${mm}.${date.getFullYear()}`;
  };

  const dateNow = new Date();

  const userObservatory = useSelector(state => state.userObservatory);
  const dailyActions = useSelector(state => state.dailyActions);

  const history = useHistory();

  const dispatch = useDispatch();

  const stations = useSelector(state => state.stations);

  const [types, setTypes] = useState([]);
  const [locations, setLocations] = useState([]);

  const [day, setDay] = useState(dateNow);
  const [observers, setObservers] = useState("");
  const [comment, setComment] = useState("");
  const [type, setType] = useState("");
  const [location, setLocation] = useState("");

  const [disabled, setDisabled] = useState(false);

  const [formSent, setFormSent] = useState(false);
  const [errorHappened, setErrorHappened] = useState(false);

  const [latestDays, setLatestDays] = useState([]);

  const [shorthand, setShorthand] = useState("");
  const [sanitizedShorthand, setSanitizedShorthand] = useState("");
  const [codeMirrorHasErrors, setCodeMirrorHasErrors] = useState(false);


  useEffect(() => {
    getLatestDays(userObservatory)
      .then(daysJson => setLatestDays(daysJson));
  }, [userObservatory]);


  const emptyAllFields = () => {
    //setDay(dateNow);
    //setObservers("");
    //setComment("");
    //setType("");
    //setLocation("");
    setShorthand("");
  };

  const setActions = (selectedActions) => {
    if (selectedActions.length !== 0) {
      dispatch(setDailyActions(selectedActions));
    }
  };


  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setFormSent(false);
    setErrorHappened(false);
  };

  useEffect(() => {
    if (Object.keys(userObservatory).length !== 0) {
      setTypes(
        stations
          .find(s => s.observatory === userObservatory)
          .types
      );
    }
  });

  useEffect(() => {
    if (Object.keys(userObservatory).length !== 0) {
      setLocations(
        stations
          .find(s => s.observatory === userObservatory)
          .locations
      );
    }
  });

  const sendData = async () => {
    const rows = sanitizedShorthand;
    setDisabled(true);
    console.log("actions", dailyActions);
    try {
      await sendDay({
        day: formatDate(day),
        comment,
        observers,
        observatory: userObservatory,
        //selectedActions: dailyActions
      });
      await loopThroughObservationPeriods(rows, type, location);
      await loopThroughObservations(rows);
      //await sendShorthand(makeSendDataJson(
      //  formatDate(day), userObservatory, comment, observers, location, type, rows));
      setFormSent(true);
      emptyAllFields();
      dispatch(retrieveDays());
      getLatestDays(userObservatory)
        .then(daysJson => setLatestDays(daysJson));
    } catch (error) {
      console.error(error.message);
      setErrorHappened(true);
    }
    setDisabled(false);
  };

  const user = useSelector(state => state.user);
  const userIsSet = Boolean(user.id);

  if (!userIsSet) {
    return (
      <Redirect to="/login" />
    );
  }

  const ErrorPaper = () => {
    if (codeMirrorHasErrors) {
      return (
        <Paper className={classes.errorPaper} >
          <Grid item xs={12}>
            <Typography variant="h5" component="h2" className={classes.errorHeading} >
              <WarningIcon fontSize="inherit" />&nbsp;&nbsp;
              {t("checkShorthand")}
            </Typography>
            <List>
              {
                getErrors().map((error, i) =>
                  <ListItem key={i}>
                    {error[1]}
                  </ListItem>
                )
              }
            </List>
          </Grid>
        </Paper >);
    }
    return null;
  };

  const saveButtonDisabled = () => {
    if (codeMirrorHasErrors || observers === "" || type === "" || location === "" || shorthand.trim() === "")
      return true;
    else
      return false;
  };

  const handleDateClick = (s) => {
    history.push(`/daydetails/${s.day}/${userObservatory}`);
  };

  return (
    <div>
      <Grid container
        alignItems="flex-start"
      >
        <Grid item xs={8}>
          <Paper className={classes.obsPaper}>
            <Grid container
              alignItems="flex-start"
              spacing={1}>
              <Grid item xs={6} >
                <Typography variant="h5" component="h2" >
                  {t("addObservations")}
                </Typography>
                <br />
              </Grid>
              <Grid item xs={6}>
                <Box display="flex" justifyContent="flex-end">
                  <ObservatorySelector />
                </Box>
              </Grid>
              <Grid item xs={3} background-color={"red"} style={{ minWidth: "150px" }}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    className={classes.datePicker}
                    required
                    disableToolbar
                    invalidDateMessage
                    variant="inline"
                    format="dd.MM.yyyy"
                    id="date-picker-inline"
                    label={t("date")}
                    value={day}
                    onChange={(date) => {
                      setDay(date);
                      searchDayInfo(formatDate(date), userObservatory).then((dayJson)  => {
                        setObservers(dayJson[0]["observers"]);
                        setComment(dayJson[0]["comment"]);
                        //setActions(dayJson[0]["selectedActions"]));
                        setActions({ vakiohavainto:true, gåu:true, rengastusvakio:false, pöllövakio:false,nisäkkäät:false,liitteet: 0 });
                      });
                    }}
                    KeyboardButtonProps={{
                      "aria-label": "change date",
                    }}
                  />

                </MuiPickersUtilsProvider>
              </Grid>

              <Grid item xs={9}>
                <TextField required
                  fullWidth={true}
                  id="observers"
                  label={t("observers")}
                  onChange={(event) => setObservers(event.target.value)}
                  value={observers}
                />
              </Grid>

              <Grid item xs={12} sm={12}>
                <TextField
                  rows={5}
                  multiline={true}
                  id="comment"
                  fullWidth={true}
                  label={t("comment")}
                  onChange={(event) => setComment(event.target.value)}
                  value={comment}
                />
              </Grid>
              <DailyActions
              />

              <Grid item xs={3}>
                <FormControl className={classes.formControl}>
                  <InputLabel id="Tyyppi">{t("type")}</InputLabel>
                  <Select required
                    labelId="type"
                    fullWidth={true}
                    id="selectType"
                    value={type}
                    onChange={(event) => setType(event.target.value)}
                  >
                    {
                      types.map((type, i) =>
                        <MenuItem id={type} value={type} key={i}>
                          {type}
                        </MenuItem>
                      )
                    }
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={3}>
                <FormControl className={classes.formControl}>
                  <InputLabel id="Location">{t("location")}</InputLabel>
                  <Select required
                    labelId="location"
                    id="selectLocation"
                    value={location}
                    onChange={(event) => setLocation(event.target.value)}
                  >
                    {
                      locations.map((location, i) =>
                        <MenuItem id={location} value={location} key={i}>
                          {location}
                        </MenuItem>
                      )
                    }
                  </Select>
                </FormControl>
              </Grid>

              <br />
              <br />
              <Grid item xs={12}>
                <Grid container spacing={2}>
                </Grid>
                <br />
              </Grid>

              <Grid item xs={12}>
                <CodeMirrorBlock
                  shorthand={shorthand}
                  setShorthand={setShorthand}
                  setSanitizedShorthand={setSanitizedShorthand}
                  setCodeMirrorHasErrors={setCodeMirrorHasErrors}
                />
              </Grid>
              <Button
                id="saveButton"
                className={classes.sendButton}
                onClick={sendData}
                disabled={saveButtonDisabled() || disabled}
                color="primary"
                variant="contained"
              >
                {disabled ? t("loading") : t("save")}
              </Button>
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Grid item xs={12}>
            <Paper className={classes.infoPaper}>
              <Grid item xs={12}>
                <Typography variant="h5" component="h2" >
                  {t("latestDays")}
                </Typography>
                <br />
                <Table>
                  <TableBody>
                    {
                      latestDays
                        .map((s, i) =>
                          <TableRow id="latestDaysRow" key={i} hover
                            onClick={() => handleDateClick(s)} className={classes.pointerCursor} >
                            <StyledTableCell component="th" scope="row">
                              <Link style={{ color: "black" }} to={`/daydetails/${s.day}/${userObservatory}`}>
                                {s.day}
                              </Link>
                            </StyledTableCell>
                            <StyledTableCell component="th" scope="row">
                              <Link style={{ color: "black" }} to={`/daydetails/${s.day}/${userObservatory}`}>
                                {s.speciesCount} {t("multipleSpecies")}
                              </Link>
                            </StyledTableCell>
                          </TableRow>
                        )
                    }
                  </TableBody>
                </Table>
              </Grid>
              <br />
              <br />
              <Grid item xs={12} mt={0}>
                <Typography variant="h5" component="h2" >
                  {t("links")}
                  <br />
                  <br />
                </Typography>
                <Link style={{ color: "black" }} to="/listdays"><Typography variant="subtitle1">
                  Näytä päivät</Typography></Link>
                <Link style={{ color: "black" }} to="/manual"><Typography variant="subtitle1">
                  Käyttöohjeet</Typography></Link>

              </Grid>
            </Paper>
            <ErrorPaper />
          </Grid>
        </Grid>
      </Grid>
      <Snackbar open={formSent} autoHideDuration={5000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success">
          {t("formSent")}
        </Alert>
      </Snackbar>
      <Snackbar open={errorHappened} autoHideDuration={5000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error">
          {t("formNotSent")}
        </Alert>
      </Snackbar>
    </div>
  );
};
