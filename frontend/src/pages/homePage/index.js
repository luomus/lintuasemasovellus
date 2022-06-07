import React, {
  useEffect,
  useState
} from "react";
import {
  Paper, Grid, Modal, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
  Typography, TextField, Button, Checkbox, FormControlLabel,
  FormControl, InputLabel, Select, MenuItem, Snackbar, CircularProgress,
  Table, TableRow, TableBody, TableCell, withStyles, Accordion,
  AccordionSummary, AccordionDetails, IconButton
} from "@material-ui/core/";
import { Add, ExpandMore, Event, FileCopy } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import localeFI from "date-fns/locale/fi";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import PropTypes from "prop-types";
import Alert from "../../globalComponents/Alert";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/idea.css";
import {
  loopThroughObservationPeriods,
  loopThroughObservations,
} from "../../shorthand/parseShorthandField";
import { searchDayInfo, getLatestDays, getCatches, sendEverything, sendDay, getDays } from "../../services";
import { retrieveDays, setDays } from "../../reducers/daysReducer";
import { setDailyActions, setDefaultActions } from "../../reducers/dailyActionsReducer";
import CodeMirrorBlock from "../../globalComponents/codemirror/CodeMirrorBlock";
import DailyActions from "../../globalComponents/dayComponents/dailyActions";
import { addOneCatchRow, setCatches } from "../../reducers/catchRowsReducer";
import CatchType from "../../globalComponents/dayComponents/catchType";
import Notification from "../../globalComponents/Notification";
import { resetNotifications } from "../../reducers/notificationsReducer";
import Help from "../../globalComponents/Help";

const useStyles = makeStyles((theme) => ({
  obsPaper: {
    background: "white",
    padding: "20px 30px",
    margin: "10px 10px 60px 10px",
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
    marginBottom: "20px",
    marginRight: "10px",
    marginTop: "20px",
    position: "static"
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
  catchRowEven: {
    backgroundColor: "#f7f7f7",
  },
  loadingIcon: {
    padding: "0px 5px 0px 0px",
    margin: "10px"
  },
  buttonAndIconsContainer: {
    display: "flex",
    alignItems: "center"
  }
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


export const HomePage = ({ user, userObservatory }) => {
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

  const dailyActions = useSelector(state => state.dailyActions);
  const catchRows = useSelector(state => state.catchRows);
  const stations = useSelector(state => state.stations);
  const notifications = useSelector(state => state.notifications);

  const history = useHistory();
  const dispatch = useDispatch();

  const [types, setTypes] = useState([]);
  const [locations, setLocations] = useState([]);
  const [day, setDay] = useState(dateNow);
  const [observers, setObservers] = useState("");
  const [comment, setComment] = useState("");
  const [type, setType] = useState("");
  const [location, setLocation] = useState("");
  const [saveDisabled, setSaveDisabled] = useState(false);
  const [toDayDetailsDisabled, setToDayDetailsDisabled] = useState(false);
  const [formSent, setFormSent] = useState(false);
  const [saveLoadingIcon, setSaveLoadingIcon] = useState(false);
  const [toDayDetailsLoadingIcon, setToDayDetailsLoadingIcon] = useState(false);
  const [errorHappened, setErrorHappened] = useState(false);
  const [latestDays, setLatestDays] = useState([]);
  const [shorthand, setShorthand] = useState("");
  const [sanitizedShorthand, setSanitizedShorthand] = useState("");
  const [dateChangeConfirm, setDateChangeConfirm] = useState(false);
  const [openCopy, setOpenCopy] = useState(false);
  const [toCopy, setToCopy] = useState({
    "observers": false, "comment": false,
    "observationActivity": false, "catches": false
  });

  useEffect(() => {
    getLatestDays(userObservatory)
      .then(daysJson => setLatestDays(daysJson));
  }, [userObservatory]);

  useEffect(() => {
    dispatch(retrieveDays());
    handleDateChange(dateNow);
  }, [dispatch]);

  const emptyAllFields = () => {
    setType("");
    setLocation("");
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
    getCatches(dayId)
      .then(res => dispatch(setCatches(res)));
  };

  const readyDailyActions = () => {
    if ("attachments" in dailyActions) {
      if (dailyActions.attachments === "" || dailyActions.attachments < 0) {
        return JSON.stringify({ ...dailyActions, "attachments": 0 });
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
    if (stations.length > 0 && userObservatory !== "") {
      setTypes(
        stations
          .find(s => s.observatory === userObservatory)
          .types
      );
    }
  }, [stations, userObservatory]);

  useEffect(() => {
    if (stations.length > 0 && userObservatory !== "") {
      setLocations(
        stations
          .find(s => s.observatory === userObservatory)
          .locations
      );
    }
  }, [stations, userObservatory]);

  const sendData = async () => {
    setSaveLoadingIcon(true);
    const rows = sanitizedShorthand;
    const observationPeriodsToSend = loopThroughObservationPeriods(rows, type, location);
    const observationsToSend = loopThroughObservations(rows, user.id);
    setSaveDisabled(true);
    let data = {
      day: formatDate(day),
      comment: comment,
      observers: observers,
      observatory: userObservatory,
      selectedactions: readyDailyActions(),
      userID: user.id,
      catches: catchRows,
      observationPeriods: observationPeriodsToSend,
      observations: observationsToSend
    };

    try {
      await sendEverything(data);
      setFormSent(true);
      emptyAllFields();
      dispatch(retrieveDays());
      getLatestDays(userObservatory)
        .then(daysJson => setLatestDays(daysJson));
    } catch (error) {
      console.error(error.message);
      setErrorHappened(true);
    }
    setSaveLoadingIcon(false);
    setSaveDisabled(false);
  };

  const handleToDayDetailsClick = async () => {
    setToDayDetailsLoadingIcon(true);
    setToDayDetailsDisabled(true);
    const defaultActions = JSON.stringify(dispatch(setDefaultActions(userObservatory)).data.dailyActions);
    try {
      const searchResult = await searchDayInfo(formatDate(day), userObservatory);
      //Update if observers is changed
      if (searchResult[0].observers !== observers) {
        const data = {
          day: formatDate(day),
          observers: observers,
          observatory: userObservatory,
          comment: searchResult[0].comment,
          selectedactions: searchResult[0].selectedactions === "" ?
            defaultActions : searchResult[0].selectedactions
        };
        await sendDay(data);
        const days = await getDays();
        dispatch(setDays(days));
      }
      history.push(`/daydetails/${formatDate(day)}`);
    } catch (error) {
      console.error(error.message);
      setErrorHappened(true);
    }
    setToDayDetailsLoadingIcon(false);
    setToDayDetailsDisabled(false);
  };

  const addCatchRow = () => {
    dispatch(addOneCatchRow());
  };

  const confirmDate = () => {
    setDateChangeConfirm(true);
    setTimeout(function () {
      setDateChangeConfirm(false);
    }, 10000);
  };

  const saveButtonDisabled = () => {
    if (observers === "" || observers.trim() === "" || type === "" || location === "" || shorthand.trim() === "" || errorsInInput())
      return true;
    else
      return false;
  };

  const toDayDetailsButtonDisabled = () => {
    if (observers === "" || observers.trim() === "")
      return true;
    else
      return false;
  };

  const errorsInInput = (category = "all") => {
    let value = false;
    Object.keys(notifications).map(cat => {
      if (cat === category || category === "all") {
        Object.keys(notifications[String(cat)]).map(row => {
          if (notifications[String(cat)][String(row)].errors.length > 0) {
            value = true;
          }
        });
      }
    });
    return value;
  };

  const handleDateClick = (s) => {
    history.push(`/daydetails/${s.day}`);
  };

  const handleCopyConfirm = () => {
    let previousDay = new Date(day);
    previousDay.setDate(day.getDate() - 1);
    searchDayInfo(formatDate(previousDay), userObservatory).then((dayJson) => {
      if (dayJson[0]["id"] !== 0) {
        if (toCopy.observers) {
          setObservers(dayJson[0]["observers"]);
        }
        if (toCopy.comment) {
          setComment(dayJson[0]["comment"]);
        }
        if (toCopy.observationActivity) {
          setActions(dayJson[0]["selectedactions"]);
        }
        if (toCopy.catches) {
          setCatchRows(dayJson[0]["id"]);
        }
        dispatch(resetNotifications());
      }
    });
    setToCopy({
      "observers": false, "comment": false,
      "observationActivity": false, "catches": false
    });
    setOpenCopy(false);
  };

  const handleCopyClose = () => {
    setToCopy({
      "observers": false, "comment": false,
      "observationActivity": false, "catches": false
    });
    setOpenCopy(false);
  };

  const handleOpenCopy = () => {
    setOpenCopy(true);
  };

  const handleCopyChange = (name) => {
    setToCopy({ ...toCopy, [name]: !toCopy[String(name)] });
  };

  const handleDateChange = (date) => {
    if ((catchRows.length === 0 && observers === "" && comment === "") || dateChangeConfirm) {
      const newDate = date;
      setDay(newDate);
      searchDayInfo(formatDate(date), userObservatory).then((dayJson) => {
        setObservers(dayJson[0]["observers"]);
        dayJson[0]["comment"] === null ? setComment("") :
          setComment(dayJson[0]["comment"]);
        setActions(dayJson[0]["selectedactions"]);
        setCatchRows(dayJson[0]["id"]);
        dispatch(resetNotifications());
      });
    } else if (confirm(t("changeDateWhenObservationsConfirm"))) {
      confirmDate();
      setDay(date);
      searchDayInfo(formatDate(date), userObservatory).then((dayJson) => {
        setObservers(dayJson[0]["observers"]);
        dayJson[0]["comment"] === null ? setComment("") :
          setComment(dayJson[0]["comment"]);
        setActions(dayJson[0]["selectedactions"]);
        setCatchRows(dayJson[0]["id"]);
        dispatch(resetNotifications());
      });
    }
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
              <Grid item xs={11} >
                <Typography variant="h5" component="h2" >
                  {t("addObservations")} - {userObservatory.replace("_", " ")}
                </Typography>
                <br />
              </Grid>
              <Grid container item xs={1} justify="flex-end">
                <IconButton id="open-copy-button" size="small" onClick={handleOpenCopy} variant="contained" color="primary">
                  <FileCopy fontSize="default" />
                </IconButton>
              </Grid>
              <Grid item xs={3} background-color={"red"} style={{ minWidth: "150px" }}>
                <MuiPickersUtilsProvider utils={DateFnsUtils} locale={localeFI}>
                  <KeyboardDatePicker
                    className={classes.datePicker}
                    required
                    disableToolbar
                    invalidDateMessage={t("invalidDate")}
                    minDateMessage={t("minDateError")}
                    maxDateMessage={t("maxDateError")}
                    variant="inline"
                    format="dd.MM.yyyy"
                    id="date-picker-inline"
                    label={t("date")}
                    value={day}
                    onChange={(date) => {
                      handleDateChange(date);
                    }}
                    KeyboardButtonProps={{
                      "aria-label": "change date",
                    }}
                    keyboardIcon={<Event color="primary" />}
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
              <Grid className={classes.buttonAndIconsContainer}>
                <Button
                  id="toDayDetails"
                  className={classes.sendButton}
                  onClick={handleToDayDetailsClick}
                  disabled={toDayDetailsButtonDisabled() || toDayDetailsDisabled}
                  color="primary"
                  variant="contained"
                  title="Siirry valitun päivän koontinäkymään"
                >
                  {t("toDayDetails")}
                </Button>
                <Help title={t("helpForToDayDetailsButton")}/>
                { (toDayDetailsLoadingIcon) &&
                  <CircularProgress className={classes.loadingIcon} color="primary"/>
                }
              </Grid>
              <div className={classes.accordionRoot}>
                <br />
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMore color="primary" />}
                    aria-controls="comment-content"
                    id="comment-header"
                  >
                    <Typography className={classes.sectionHeading}>{t("comment")}</Typography>
                    <Typography className={classes.secondaryHeading}>{comment ? t("commentAdded") : t("noComment")}</Typography>
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
                    expandIcon={<ExpandMore color="primary" />}
                    aria-controls="activity-content"
                    id="activity-header"
                  >
                    <Typography className={classes.sectionHeading}>{t("ObservationActivity")}</Typography>

                    <Typography className={classes.secondaryHeading} color={(errorsInInput("dailyactions")) ? "error" : "inherit"}>
                      {
                        (errorsInInput("dailyactions")) ? t("errorsInObservationActivity")
                          : (dailyActions.attachments > "0" || Object.values(dailyActions).includes(true)) ? t("observationActivityAdded")
                            : t("noObservationActivity")
                      }
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container
                      alignItems="flex-start"
                      spacing={1}
                    >
                      <DailyActions />
                    </Grid>
                  </AccordionDetails>
                </Accordion>

                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMore color="primary" />}
                    aria-controls="catches-content"
                    id="catches-header"
                  >
                    <Typography className={classes.sectionHeading}>{t("catches")}</Typography>
                    <Typography className={classes.secondaryHeading} color={(errorsInInput("catches")) ? "error" : "inherit"}>
                      {
                        (errorsInInput("catches")) ? t("errorsInCatches")
                          : (catchRows.length === 0 || catchRows[0].pyydys === "" || catchRows[0].pyyntialue === "") ? t("noCatches")
                            : t("catchesAdded")
                      }
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container
                      alignItems="flex-start"
                      spacing={1}
                    >
                      <Notification category="catches" />

                      {catchRows.map((cr, i) => (
                        i % 2 === 0
                          ? (
                            <Grid key={i} id={i} item xs={12}>
                              <CatchType key={cr.key} cr={cr} />
                            </Grid>
                          )
                          : (
                            <Grid key={i} id={i} item xs={12} className={classes.catchRowEven}>
                              <CatchType key={cr.key} cr={cr} />
                            </Grid>
                          )
                      ))}

                      <Grid item xs={12}>
                        <IconButton id="plus-catch-row-button" size="small" onClick={addCatchRow} variant="contained" color="primary">
                          <Add fontSize="default" />
                        </IconButton>
                        &nbsp; {(catchRows.length === 0) ? t("addRowByClicking") : ""}
                      </Grid>
                      <Grid item xs={3}>
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>

                <Accordion defaultExpanded>
                  <AccordionSummary
                    expandIcon={<ExpandMore color="primary" />}
                    aria-controls="obervation-content"
                    id="observation-header"
                  >
                    <Typography className={classes.sectionHeading}>{t("migrantObservations")} *</Typography>
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
                        />
                      </Grid>
                    </Grid>

                  </AccordionDetails>
                </Accordion>

              </div>

              <Grid item xs={12}>
                <Button
                  id="saveButton"
                  className={classes.sendButton}
                  onClick={sendData}
                  disabled={saveButtonDisabled() || saveDisabled}
                  color="primary"
                  variant="contained"
                >
                  {saveDisabled ? t("loading") : t("saveMigrant")}
                </Button>
                { (saveLoadingIcon) &&
                  <CircularProgress className={classes.loadingIcon} color="primary"/>
                }
              </Grid>

            </Grid>
          </Paper>
        </Grid>

        {/* Side panel */}
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
                              <Link style={{ color: "black" }} to={`/daydetails/${s.day}`}>
                                {s.day}
                              </Link>
                            </StyledTableCell>
                            <StyledTableCell component="th" scope="row">
                              <Link style={{ color: "black" }} to={`/daydetails/${s.day}`}>
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
            <Notification category="shorthand" />
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
      <Modal
        open={openCopy}
        onClose={handleCopyClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <Dialog
          open={openCopy}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{t("copy")}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {t("chooseCopy")} <br />
              {t("overwrite")}
            </DialogContentText>
            <FormControlLabel className={classes.formControlLabel}
              control={<Checkbox id="copy-observers-box" checked={toCopy.observers} onChange={(event) => handleCopyChange(event.target.name)} name="observers" color="primary" className={classes.checkbox} />}
              label={t("observers")} labelPlacement="end" />
            <FormControlLabel className={classes.formControlLabel}
              control={<Checkbox id="copy-comment-box" checked={toCopy.comment} onChange={(event) => handleCopyChange(event.target.name)} name="comment" color="primary" className={classes.checkbox} />}
              label={t("comment")} labelPlacement="end" />
            <FormControlLabel className={classes.formControlLabel}
              control={<Checkbox id="copy-activity-box" checked={toCopy.observationActivity} onChange={(event) => handleCopyChange(event.target.name)} name="observationActivity" color="primary" className={classes.checkbox} />}
              label={t("ObservationActivity")} labelPlacement="end" />
            <br />
            <FormControlLabel className={classes.formControlLabel}
              control={<Checkbox id="copy-catches-box" checked={toCopy.catches} onChange={(event) => handleCopyChange(event.target.name)} name="catches" color="primary" className={classes.checkbox} />}
              label={t("catches")} labelPlacement="end" />
          </DialogContent>
          <DialogActions>
            <Button id="confirm-copy-button" onClick={handleCopyConfirm} color="primary" variant="contained">
              {t("confirm")}
            </Button>
            <Button id="cancel-copy-button" onClick={handleCopyClose} color="secondary" variant="contained" autoFocus>
              {t("cancel")}
            </Button>
          </DialogActions>
        </Dialog>
      </Modal>
    </div>
  );
};

HomePage.propTypes = {
  user: PropTypes.object.isRequired,
  userObservatory: PropTypes.string.isRequired
};