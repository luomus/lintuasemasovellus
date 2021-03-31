import React, {
  useEffect,
  useState
} from "react";
import {
  Paper, Grid,
  Typography, TextField, Button,
  FormControl, InputLabel, Select, MenuItem, Snackbar,
  Table, TableRow, TableBody, TableCell, withStyles, Accordion,
  AccordionSummary, AccordionDetails
} from "@material-ui/core/";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { makeStyles } from "@material-ui/core/styles";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import localeFI from "date-fns/locale/fi";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { Redirect, Link, useHistory } from "react-router-dom";
import Alert from "../../globalComponents/Alert";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/idea.css";
import {
  sendDay,
  loopThroughObservationPeriods,
  loopThroughObservations,
  sendCatches,
  //sendShorthand,
  //makeSendDataJson,
} from "./parseShorthandField";
import { searchDayInfo, getLatestDays, getCatches } from "../../services";
import { retrieveDays } from "../../reducers/daysReducer";
import { setDailyActions, setDefaultActions } from "../../reducers/dailyActionsReducer";
import CodeMirrorBlock from "../../globalComponents/codemirror/CodeMirrorBlock";
//import { getErrors } from "../../shorthand/validations";
import DailyActions from "./dailyActions";
import { addOneCatchRow, setCatches } from "../../reducers/catchRowsReducer";
import CatchType from "./catchType";
import ErrorPaper from "../../globalComponents/codemirror/ErrorPaper";
import Notification from "./notification";


const useStyles = makeStyles((theme) => ({
  obsPaper: {
    background: "white",
    padding: "20px 30px",
    margin: "10px 10px 10px 10px",
  },
  infoGrid: {
    padding: "10px",
  },
  infoPaper: {
    background: "white",
    padding: "20px 30px",
    maxHeight: "34vw",
    overflow: "auto",
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
  addRemoveCatchTypesButton: {
    marginLeft: theme.spacing(1),
    marginTop: theme.spacing(0),
  },
  pointerCursor: {
    cursor: "pointer",
    textDecoration: "underline",
  },
  formControlLabel: {
    padding: "0px 100px 0px 0px",
  },
  accordionRoot: {
    width: "100%",
  },
  sectionHeading: {
    fontSize: "20px",
    flexBasis: "33.33%",
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: "15px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    opacity: "0.6",
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
  const catchRows = useSelector(state => state.catchRows);
  const stations = useSelector(state => state.stations);
  const userID = useSelector(state => state.user.id);

  const notifications = useSelector(state => state.notifications);
  console.log("notif in index", notifications);

  const history = useHistory();
  const dispatch = useDispatch();

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
    if (selectedActions) {
      dispatch(setDailyActions(JSON.parse(selectedActions)));
    } else {
      dispatch(setDefaultActions(userObservatory));
    }
  };


  const setCatchRows = (dayId) => {
    console.log("DATE", dayId);
    getCatches(dayId)
      .then(res => dispatch(setCatches(res)));
  };

  const readyDailyActions = () => {
    if ("attachments" in dailyActions) {
      if (dailyActions.attachments === "" || dailyActions.attachments <0 ) {
        return JSON.stringify({ ...dailyActions, "attachments":0 });
      }
    }
    return JSON.stringify(dailyActions);
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
    try {
      await sendDay({
        //userID: userID,
        day: formatDate(day),
        comment,
        observers,
        observatory: userObservatory,
        selectedactions: readyDailyActions()
      });
      await sendCatches(catchRows);
      await loopThroughObservationPeriods(rows, type, location);
      await loopThroughObservations(rows, userID);
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


  const addCatchRow = () => {
    dispatch(addOneCatchRow());
  };


  const user = useSelector(state => state.user);
  const userIsSet = Boolean(user.id);

  if (!userIsSet) {
    return (
      <Redirect to="/login" />
    );
  }

  const saveButtonDisabled = () => {
    if (codeMirrorHasErrors || observers === "" || type === "" || location === "" || shorthand.trim() === "" || errorsInCatchesOrActions())
      return true;
    else
      return false;
  };

  const errorsInCatchesOrActions = () => {
    let value = false;
    Object.keys(notifications).map(row => {
      console.log("mapping", notifications[String(row)]);
      if (notifications[String(row)].errors.length > 0) {
        value = true;
      }
    });
    Object.keys(catchRows).map(row => {
      if(catchRows[String(row)].lukumaara === 0){
        value = true;
      }
    });
    return value;
  };

  const handleDateClick = (s) => {
    history.push(`/daydetails/${s.day}/${userObservatory}`);
  };

  return (
    <div>
      <Grid container
        alignItems="flex-start"
      >
        <Grid item xs={9}>
          <Paper className={classes.obsPaper}>
            <Grid container
              alignItems="flex-start"
              spacing={1}>
              <Grid item xs={12} >
                <Typography variant="h5" component="h2" >
                  {t("addObservations")}
                </Typography>
                <br />
              </Grid>

              <Grid item xs={3} background-color={"red"} style={{ minWidth: "150px" }}>
                <MuiPickersUtilsProvider utils={DateFnsUtils} locale={localeFI}>
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
                      searchDayInfo(formatDate(date), userObservatory).then((dayJson) => {
                        setObservers(dayJson[0]["observers"]);
                        setComment(dayJson[0]["comment"]);
                        setActions(dayJson[0]["selectedactions"]);
                        setCatchRows(dayJson[0]["id"]);
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

              <div className={classes.accordionRoot}>

                <br />

                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="comment-content"
                    id="comment-header"
                  >
                    <Typography className={classes.sectionHeading}>{t("comment")}</Typography>
                    <Typography className={classes.secondaryHeading}>{ comment ? t("commentAdded") : t("noComment")}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <TextField
                      rows={3}
                      multiline={true}
                      id="comment"
                      fullWidth={true}
                      label={t("comment")}
                      onChange={(event) => setComment(event.target.value)}
                      value={comment}
                    />
                  </AccordionDetails>
                </Accordion>

                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="activity-content"
                    id="activity-header"
                  >
                    <Typography className={classes.sectionHeading}>{t("Observation activity")}</Typography>
                    {/* FIX THIS: Miten selvitetään, onko jokin havaintoaktiviteetti valittu? */}
                    <Typography className={classes.secondaryHeading}>{ (dailyActions.attachments === "0") ? t("noObservationActivity") : t("observationActivityAdded")}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <DailyActions />
                  </AccordionDetails>
                </Accordion>

                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="catches-content"
                    id="catches-header"
                  >
                    <Typography className={classes.sectionHeading}>{t("Catches")}</Typography>
                    <Typography className={classes.secondaryHeading}>{ (catchRows.length === 0 || catchRows[0].pyydys === "") ? t("noCatches") : t("catchesAdded")}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container
                      alignItems="flex-start"
                      spacing={1}
                    >

                      <Notification category="catches"/>

                      {catchRows.map((cr, i) => (
                        <div key={i} id={i}>
                          <CatchType key={cr.key} cr={cr} />
                        </div>
                      ))}
                      <Grid item xs={12}>
                        <Button
                          className={classes.addRemoveCatchTypesButton}
                          onClick={addCatchRow}
                          color="primary"
                          id="plus-catch-row-button"
                          variant="contained"
                          size="small"
                        >
                          {"+"}
                        </Button>

                      </Grid>
                      <Grid item xs={3}>
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>

                <Accordion defaultExpanded>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="obervation-content"
                    id="observation-header"
                  >
                    <Typography className={classes.sectionHeading}>{t("observations")} *</Typography>
                  </AccordionSummary>
                  <AccordionDetails>

                    <Grid container
                      alignItems="flex-start"
                      spacing={1}
                    >

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

                      <Grid item xs={6}>
                      </Grid>

                      <Grid item xs={12}>
                        <CodeMirrorBlock
                          shorthand={shorthand}
                          setShorthand={setShorthand}
                          setSanitizedShorthand={setSanitizedShorthand}
                          setCodeMirrorHasErrors={setCodeMirrorHasErrors}
                        />
                      </Grid>
                    </Grid>

                  </AccordionDetails>
                </Accordion>

              </div>

              <Grid item xs={12}>
                <br />
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

            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={3}>
          <Grid item xs={12} className={classes.infoGrid}>
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
                  {t("showDaysPage")}</Typography></Link>
                <Link style={{ color: "black" }} to="/manual"><Typography variant="subtitle1">
                  {t("manualTitle")}</Typography></Link>

              </Grid>
            </Paper>
            <ErrorPaper codeMirrorHasErrors={codeMirrorHasErrors} />
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
