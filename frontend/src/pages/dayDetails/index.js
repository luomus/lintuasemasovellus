import React, {useCallback, useEffect, useState} from "react";
import { useParams } from "react-router-dom";
import {
  Button, Box, IconButton, Paper, Grid, Typography, TextField,
  FormGroup, FormControlLabel,
  Table, TableBody, TableCell, TableHead, TableRow
} from "@mui/material";
import { makeStyles, withStyles } from "@mui/styles";
import { Edit, Add, CheckCircle, RemoveCircleOutlineRounded } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import ObsPeriodTable from "./ObsPeriodTable";
import EditShorthand from "../editShorthand";
import DailyActions from "../../globalComponents/dayComponents/dailyActions";
import CatchType from "../../globalComponents/dayComponents/catchType";
import { setDefaultActions, setDailyActions } from "../../reducers/dailyActionsReducer";
import { setCatches, addOneCatchRow, setNewCatchRow } from "../../reducers/catchRowsReducer";
import { resetNotifications } from "../../reducers/notificationsReducer";
import Notification from "../../globalComponents/Notification";
import AntTabs from "./AntTabs";

import {
  getDaysObservationPeriods,
  editComment, editObservers, editActions, getSummary, getCatches, editCatchRow, deleteCatchRow
} from "../../services";
import TextEdit from "./TextEdit";

const useStyles = makeStyles((theme) => ({
    paper: {
      background: "white",
      padding: "20px 30px",
      margin: "0px 0px 50px 0px",
    },
    button: {
      marginLeft: "5px",
    },
    obsAndComment: {
      marginRight: "5px",
      marginBottom: "5px",
    },
    formControlLabel: {
      padding: "0px 100px 0px 0px",
    },
    checkedDailyAction: {
      margin: "11px",
    },
    uncheckedDailyAction: {
      margin: "11px",
    },
    attachment: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: 75,
    },
    blackDisabledLabel: {
      label: {
        color: "rgba(0, 0, 0, 1)",
        fontSize: "50px"
      }
    },
    catchTable: {
      maxWidth: "65%",
    },
    deleteButton: {
      marginLeft: "5px",
      color: "white",
      backgroundColor: theme.palette.error.main,
      "&:hover": {
        backgroundColor: theme.palette.error.dark,
      },
    },
  })
);

const DisabledTextField = withStyles({
  root: {
    "& .MuiInputBase-root .Mui-disabled": {
      color: "rgba(0, 0, 0, 1)", // (default alpha is 0.38)
      "-webkit-text-fill-color":  "rgba(0, 0, 0, 1)"
    }
  }
})(TextField);

export const DayDetails = ({ userObservatory }) => {

  const { day } = useParams();

  const classes = useStyles();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const dayList = useSelector(state => state.days);
  const notifications = useSelector(state => state.notifications);
  const editedActions = useSelector(state => state.dailyActions);
  const editedCatches = useSelector(state => state.catchRows);

  const [obsPeriods, setObsperiods] = useState([]);
  const [summary, setSummary] = useState([]);
  const [mode, setMode] = useState("speciesTable");
  const [editShorthandModalOpen, setEditShorthandModalOpen] = useState(false);
  const [actionsEditMode, setActionsEditMode] = useState(false);
  const [catchesEditMode, setCatchesEditMode] = useState(false);
  const [addingNewRowMode, setAddingNewRowMode] = useState(false);
  const [catches, setDayCatches] = useState([]);
  const [catchRowToEdit, setCatchRowToEdit] = useState({});
  const [dayId, setDayId] = useState();
  const [observers, setObservers] = useState();
  const [comment, setComment] = useState();
  const [selectedActions, setSelectedActions] = useState();
  const [thisDay, setThisDay] = useState(null);
  const [errorsInCatches, setErrorsInCacthes] = useState(false);
  const [errorsInActions, setErrorsInActions] = useState(false);

  useEffect(() => {
    setThisDay(dayList.find(d => d.day === day && d.observatory === userObservatory) || null);
  }, [dayList, day, userObservatory]);


  useEffect(() => {
    if (thisDay) {
      setDayId(thisDay.id);
      setObservers(thisDay.observers);
      setComment(thisDay.comment);
      setSelectedActions(thisDay.selectedactions
        ? JSON.parse(thisDay.selectedactions)
        : {});
      /*setSelectedActions(thisDay.selectedactions
        ? JSON.parse(dayList.find(d => d.day === day && d.observatory === userObservatory)
          .selectedactions)
        : {} || {});*/
    } else {
      setDayId(null);
      setObservers(null);
      setComment(null);
      setSelectedActions(null);
    }
  }, [thisDay]);

  useEffect(() => {
    if (dayId !== undefined && dayId !== null) {
      getCatches(dayId)
        .then(res => setDayCatches(res));
    }
  }, [dayId]);

  useEffect(() => {
    let value = false;
    Object.keys(notifications["catches"]).map(row => {
      if (notifications["catches"][String(row)].errors.length > 0) {
        value = true;
      }
    });
    Object.keys(editedCatches).map(row => {
      if (editedCatches[String(row)].lukumaara === 0) {
        value = true;
      }
    });
    setErrorsInCacthes(value);
  }, [notifications, editedCatches]);

  useEffect(() => {
    let value = false;
    Object.keys(notifications["dailyactions"]).map(row => {
      if (notifications["dailyactions"][String(row)].errors.length > 0) {
        value = true;
      }
    });
    setErrorsInActions(value);
  }, [notifications]);

  const observersOnSave = useCallback((newObservers) => {
    if (newObservers.length !== 0) {
      setObservers(newObservers);
      editObservers(dayId, newObservers)
        .then(dayJson => setDayId(dayJson.data.id));
    }
  }, [dayId]);

  const commentOnSave = useCallback((newComment) => {
    setComment(newComment);
    editComment(dayId, newComment)
      .then(dayJson => setDayId(dayJson.data.id));
  }, [dayId]);

  useEffect( () => {
    let fetching = false;
    getDaysObservationPeriods(dayId)
      .then(periodsJson => {
        if (!fetching) {
          setObsperiods(periodsJson);
        }
      });
    getSummary(dayId)
      .then(periodsJson => {
        if (!fetching) {
          setSummary(periodsJson);
        }
      });
    return () => (fetching = true);
  }, [dayId]);

  const handleEditShorthandOpen = useCallback(() => {
    setEditShorthandModalOpen(true);
  }, []);

  const handleActionsEditOpen = useCallback(() => {
    dispatch(setDailyActions(selectedActions));
    setActionsEditMode(!actionsEditMode);
  }, [selectedActions, actionsEditMode]);

  const handleActionsEditCancel = useCallback(() => {
    dispatch(setDefaultActions(userObservatory));
    setActionsEditMode(!actionsEditMode);
  }, [userObservatory, actionsEditMode]);

  const handleActionsEditSave = useCallback(() => {
    let actionsToSave = editedActions;
    if ("attachments" in actionsToSave) {
      if (actionsToSave.attachments === "" || actionsToSave.attachments < 0) {
        actionsToSave = { ...actionsToSave, "attachments": 0 };
      }
    }
    editActions(dayId, JSON.stringify(actionsToSave))
      .then(dayJson => setDayId(dayJson.data.id));
    setSelectedActions(actionsToSave);
    setActionsEditMode(!actionsEditMode);
    dispatch(setDefaultActions(userObservatory));
  }, [dayId, editedActions, actionsEditMode, userObservatory]);

  const handleCatchesEditOpen = useCallback((event) => {
    const c = event.target.getAttribute('data-cache');
    const key = catches[c].key;
    // send info to reducer
    dispatch(resetNotifications());
    const row = catches.filter(c => c.key === key);
    setCatchRowToEdit(row[0]);
    dispatch(setCatches(row));
    setCatchesEditMode(!actionsEditMode);
  }, [catches, actionsEditMode]);

  const handleCatchesEditCancel = useCallback(() => {
    setCatchRowToEdit({});
    dispatch(setCatches([]));
    dispatch(resetNotifications());
    setCatchesEditMode(false);
    setAddingNewRowMode(false);
  }, []);

  const handleAddNewCatch = useCallback(() => {
    setAddingNewRowMode(true);
    if (catches.length === 0) {
      dispatch(setNewCatchRow());
    } else {
      const maxKey = Math.max.apply(Math, catches.map(row => row.key));
      dispatch(addOneCatchRow(maxKey + 1));
    }
    dispatch(resetNotifications());
    setCatchesEditMode(true);
  }, [catches]);

  const handleCatchesEditSave = useCallback(() => {
    if (editedCatches.length === 0) {
      if (catchRowToEdit.key) {
        deleteCatchRow(dayId, catchRowToEdit);
        setDayCatches(catches.filter(row => row.key !== catchRowToEdit.key));
      }
    } else {
      editCatchRow(dayId, editedCatches);
      if (addingNewRowMode) {
        setDayCatches([...catches, editedCatches[0]]);
      } else {
        setDayCatches(catches.map(row => row.key === editedCatches[0].key
          ? editedCatches[0]
          : row));
      }
    }
    dispatch(setCatches([]));
    setCatchRowToEdit({});
    dispatch(resetNotifications());
    setCatchesEditMode(false);
    setAddingNewRowMode(false);
  }, [dayId, editedCatches, catches, catchRowToEdit, addingNewRowMode]);

  const refetchObservations = useCallback(async () => {
    const res = await getDaysObservationPeriods(dayId);
    setObsperiods(res);
    const res2 = await getSummary(dayId);
    setSummary(res2);
  }, [dayId]);

  useEffect(() => {
    refetchObservations();
  }, [mode]);

  const refetchSummary = useCallback(async () => {
    const res2 = await getSummary(dayId);
    setSummary(res2);
  }, [dayId]);

  const handleEditShorthandClose = () => {
    setEditShorthandModalOpen(false);
    refetchObservations();
  };

  if (!dayId) {
    return (<>
      <Paper className={classes.paper}>
        <Typography variant="h4" component="h2" >
          {day} {" "}
          {userObservatory.replace("_", " ")}
        </Typography>
        <Typography>
          {t("noObservationsFound")}
        </Typography>
      </Paper>
    </>);
  } else {
    return (
      <>
        <Paper className={classes.paper}>
          <Grid container alignItems="flex-end" spacing={3}>
            <Grid item xs={6}>
              <Typography id="dayAndObservatory" variant="h4" component="h2" >
                {day} {" "}
                {userObservatory.replace("_", " ")}
              </Typography>
            </Grid>
            <Grid item xs={12} fullwidth="true">
              <TextEdit label={t("observers")} defaultValue={observers} onSave={observersOnSave} data-cy="observers"></TextEdit>
              <TextEdit label={t("comment")} defaultValue={comment} onSave={commentOnSave} data-cy="comment"></TextEdit>
            </Grid>

            {/* DAILY ACTIONS */}
            <Grid id="dailyActions" item xs={12} fullwidth="true">
              <Typography variant="h6" component="h2" >
                {t("ObservationActivity")}
              </Typography>
              {(selectedActions && !actionsEditMode) ?
                <FormGroup row className={classes.formGroup}>
                  {
                    Object.entries(selectedActions).filter(([key]) => key !== "attachments").map(([action, value], i) =>
                      <FormControlLabel className={classes.formControlLabel}
                        control={value
                          ? <CheckCircle name="check" fontSize="small" className={classes.checkedDailyAction} />
                          : <RemoveCircleOutlineRounded fontSize="small" className={classes.uncheckedDailyAction} />
                        }
                        label={t(action)} labelPlacement="end" key={i} style={{ cursor: "default" }}
                      />
                    )
                  }
                  <FormControlLabel className={classes.FormControlLabel}
                    control={<DisabledTextField name="attachments" id="attachments" className={classes.attachment} value={" " + selectedActions.attachments + " " + t("pcs")}
                      disabled InputProps={{ disableUnderline: true }} />}
                    label={<span style={{ color: "rgba(0, 0, 0, 1)" }}>{t("attachments")}</span>} labelPlacement="start" />

                  <Box>
                    <IconButton id="actionsButton" size="small" style={{ left: "100px", alignItems: "left" }} onClick={handleActionsEditOpen} variant="contained" color="primary"  >
                      <Edit fontSize="default" />
                    </IconButton>
                  </Box>
                </FormGroup>
                : <div style={{
                  display: "flex",
                  alignItems: "left"
                }}>
                  <DailyActions />
                  <Button id="actionsEditSave" className={classes.button} variant="contained" disabled={errorsInActions} onClick={handleActionsEditSave} color="primary">
                    {t("save")}
                  </Button>
                  <Button id="actionsEditCancel" className={classes.button} variant="contained" onClick={handleActionsEditCancel} color="secondary">
                    {t("cancel")}
                  </Button>
                </div>
              }
            </Grid>

            {/* NET ACTIONS */}
            <Grid item xs={12} fullwidth="true">
              <Typography variant="h6" component="h2" >
                {t("catches")}
              </Typography>
              {(catches.length > 0 && !catchesEditMode)
                ? /* LIST CATCHES */
                <Table className={classes.catchTable} size="medium" aria-label="a dense table">
                  <TableHead>
                    <TableRow>
                      <TableCell>{t("catchType")}</TableCell>
                      <TableCell align="left">{t("catchArea")}</TableCell>
                      <TableCell align="left">{t("wasOpen")}</TableCell>
                      <TableCell align="left">{t("amount")}</TableCell>
                      <TableCell align="left">{t("netCodes")}</TableCell>
                      <TableCell align="left">{t("length")}</TableCell>
                      <TableCell align="left">
                        <IconButton id="addCatchButton" size="small" style={{ left: "75px", alignItems: "left" }} onClick={handleAddNewCatch} variant="contained" color="primary">
                          <Add fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.keys(catches).map((c) =>
                      <TableRow key={catches[String(c)].key}>
                        <TableCell component="th" scope="row">{catches[String(c)].pyydys}</TableCell>
                        <TableCell align="left" id="catchArea">{catches[String(c)].pyyntialue}</TableCell>
                        <TableCell align="left" id="wasOpen">{catches[String(c)].alku} - {catches[String(c)].loppu}</TableCell>
                        <TableCell align="left" id="amount">{catches[String(c)].lukumaara}</TableCell>
                        <TableCell align="left" id="netCodes">{catches[String(c)].verkkokoodit ? catches[String(c)].verkkokoodit : "-"}</TableCell>
                        <TableCell align="left" id="netLength">{catches[String(c)].verkonPituus > 0 ? catches[String(c)].verkonPituus : "-"}</TableCell>
                        <TableCell align="left">
                          <IconButton id="catchesButton" size="small" style={{ left: "75px", alignItems: "left" }} data-cache={c} onClick={handleCatchesEditOpen} variant="contained" color="primary">
                            <Edit fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
                : (catchesEditMode) /* EDIT ONE CATCH ROW */
                  ?
                  <div>
                    {(editedCatches.length > 0)
                      ? /* SHOW CATCH ROW AS EDITABLE ELEMENT */
                      <div>
                        <Notification category="catches" />
                        <CatchType cr={editedCatches[0]} />
                        <Button id="catchesEditSave" className={classes.button} variant="contained"
                          onClick={handleCatchesEditSave} color="primary"
                          disabled={errorsInCatches}>
                          {t("save")}
                        </Button>
                        <Button id="catchesEditCancel" className={classes.button} variant="contained" onClick={handleCatchesEditCancel} color="secondary">
                          {t("cancel")}
                        </Button>
                      </div>
                      : /* IF ROW-TO-EDIT IS DELETED, SHOW CONFIRMATION */
                      <div>
                        <Typography variant="body1" color="error" style={{ padding: 5, }}> {t("rowRemoved")}</Typography>
                        <Button id="catchesEditSave" className={classes.deleteButton} variant="contained"
                          onClick={handleCatchesEditSave}
                          disabled={errorsInCatches}>
                          {t("remove")}
                        </Button>
                        <Button id="catchesEditCancel" className={classes.button} variant="contained" onClick={handleCatchesEditCancel} color="secondary">
                          {t("cancel")}
                        </Button>
                      </div>
                    }
                  </div>
                  : /* NO CATCHES FOR THAT DAY*/
                  <Typography variant="body1"  >
                    {t("noCatchesDeclared")}
                    <IconButton id="catchesButton" size="small" style={{ left: "75px", alignItems: "left" }} onClick={handleAddNewCatch} variant="contained" color="primary"  >
                      <Add fontSize="small" />
                    </IconButton>
                  </Typography>
              }
            </Grid>
            <Grid container style={{ justifyContent: "space-between" }}>
              <Grid item xs={1}>
                <Box display="flex" justifyContent="flex-start">
                  <AntTabs setMode={setMode}/>
                </Box>
              </Grid>
              <Grid item xs={5}>
                <Box display="flex" justifyContent="flex-end">
                  <Button variant="contained" color="primary" onClick={handleEditShorthandOpen}>
                    {t("editObservations")}
                  </Button>{" "}
                </Box>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <ObsPeriodTable
                key={day}
                date={day}
                obsPeriods={obsPeriods}
                summary={summary}
                mode={mode}
                userObservatory={userObservatory}
                refetchObservations={refetchObservations}
                refetchSummary={refetchSummary}
              />
            </Grid>
          </Grid>
          <EditShorthand
            date={day}
            dayId={dayId}
            open={editShorthandModalOpen}
            handleCloseModal={handleEditShorthandClose}
          />
        </Paper>
      </>
    );
  }
};

DayDetails.propTypes = {
  userObservatory: PropTypes.string.isRequired
};
