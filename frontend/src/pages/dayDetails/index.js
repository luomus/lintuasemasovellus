import React, { useEffect, useState } from "react";
import { Redirect, useParams } from "react-router-dom";
import {
  Button, Box, IconButton, makeStyles, Paper, Grid, Typography, TextField,
  FormGroup, FormControlLabel, withStyles
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import RemoveCircleOutlineRoundedIcon from "@material-ui/icons/RemoveCircleOutlineRounded";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import ObsPeriodTable from "./ObsPeriodTable";
import EditShorthand from "../editShorthand";
import DailyActions from "../homePage/dailyActions";
import { setDefaultActions, setDailyActions } from "../../reducers/dailyActionsReducer";
// import ObsPeriodTableOther from "./ObsPeriodTableOther";
import {
  getDaysObservationPeriods,
  // getDaysObservationPeriodsOther,
  editComment, editObservers, editActions, getSummary
} from "../../services";


const DayDetails = () => {

  const { day, stationName } = useParams();

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
    }
  })
  );

  const classes = useStyles();
  const { t } = useTranslation();
  const dispatch = useDispatch();


  const [obsPeriods, setObsperiods] = useState([]);

  const [summary, setSummary] = useState([]);

  const [observersForm, setObserversForm] = useState(false);

  const [commentForm, setCommentForm] = useState(false);

  const [editedComment, setEditedComment] = useState("");

  const [editedObservers, setEditedObservers] = useState("");

  const [mode, setMode] = useState("table1");

  const [modalOpen, setModalOpen] = useState(false);

  const [actionsEditMode, setActionsEditMode]= useState(false);

  const dayList = useSelector(state => state.days);

  const userObservatory = useSelector(state => state.userObservatory);

  const [observers, setObservers] = useState(
    dayList
      .find(d => d.day === day && d.observatory === stationName)
      .observers
  );

  const [comment, setComment] = useState(dayList
    .find(d => d.day === day && d.observatory === stationName)
    .comment
  );


  const [selectedActions, setSelectedActions] = useState(dayList
    .find(d => d.day === day && d.observatory === stationName)
    .selectedactions
    ? JSON.parse(dayList
      .find(d => d.day === day && d.observatory === stationName)
      .selectedactions)
    : {});

  const editedActions = useSelector(state => state.dailyActions);

  const [dayId, setDayId] = useState(dayList
    .find(d => d.day === day && d.observatory === stationName)
    .id
  );

  const observersOnSubmit = (event) => {
    event.preventDefault();
    if (editedObservers.length !== 0) {
      setObservers(editedObservers);
      editObservers(dayId, editedObservers)
        .then(dayJson => setDayId(dayJson.data.id));
      console.log("dayId: ", dayId);
    }
    setObserversForm(false);
  };

  const commentOnSubmit = (event) => {
    event.preventDefault();
    if (editedComment.length !== 0) {
      setComment(editedComment);
      editComment(dayId, editedComment)
        .then(dayJson => setDayId(dayJson.data.id));
      console.log("dayId: ", dayId);
    }
    setCommentForm(false);
  };

  useEffect(() => {
    getDaysObservationPeriods(dayId)
      .then(periodsJson => setObsperiods(periodsJson));
  }, [dayId]);

  useEffect(() => {
    getSummary(dayId)
      .then(periodsJson => setSummary(periodsJson));
  }, [dayId]);


  const handleOpen = () => {
    setModalOpen(true);
  };


  const handleActionsEditOpen = () => {
    dispatch(setDailyActions(selectedActions));
    setActionsEditMode(!actionsEditMode);
  };

  const handleActionsEditCancel = () => {
    dispatch(setDefaultActions(userObservatory));
    setActionsEditMode(!actionsEditMode);
  };

  const handleActionsEditSave = () => {
    let actionsToSave = editedActions;
    if ("attachments" in actionsToSave) {
      if (actionsToSave.attachments === "" || actionsToSave.attachments < 0 ) {
        actionsToSave = { ...actionsToSave, "attachments":0 };
      }
    }
    editActions(dayId, JSON.stringify(actionsToSave))
      .then(dayJson => setDayId(dayJson.data.id));
    setSelectedActions(actionsToSave);
    setActionsEditMode(!actionsEditMode);
    dispatch(setDefaultActions(userObservatory));
  };

  const refetchObservations = async () => {
    const res = await getDaysObservationPeriods(dayId);
    setObsperiods(res);
    const res2 = await getSummary(dayId);
    setSummary(res2);
  };

  const handleClose = () => {
    setModalOpen(false);
    refetchObservations();
  };

  const DisabledTextField = withStyles({
    root: {
      "& .MuiInputBase-root.Mui-disabled": {
        color: "rgba(0, 0, 0, 1)" // (default alpha is 0.38)
      }
    }
  })(TextField);


  const user = useSelector(state => state.user);
  const userIsSet = Boolean(user.id);


  if (!userIsSet) {
    return (
      <Redirect to="/login" />
    );
  }


  return (

    <div>
      <Paper className={classes.paper}>

        <Grid container alignItems="flex-end" spacing={3}>
          <Grid item xs={6}>
            <Typography variant="h5" component="h2" >
              {day} {" "}
              {stationName.replace("_", " ")}
            </Typography>
          </Grid>
          <Grid item xs={12} fullwidth="true">
            <div style={{
              display: "flex",
              alignItems: "left"
            }}>
              <Typography variant="h6" component="h2" className={classes.obsAndComment}>
                {t("observers")}{": "}{observers}{" "}
              </Typography>
              {observersForm === false ? (
                <IconButton id="observerButton" size="small" onClick={() => setObserversForm(true)} variant="contained" color="primary"  >
                  <EditIcon fontSize="small" />
                </IconButton>
              ) : (
                <form onSubmit={observersOnSubmit}>
                  <TextField
                    className={classes.obsAndComment}
                    id="observerField"
                    variant="outlined"
                    defaultValue={observers}
                    onChange={(event) => setEditedObservers(event.target.value)}
                  />
                  <Button id="observerSubmit" className={classes.button} type="submit" variant="contained" color="primary">
                    {t("save")}
                  </Button>
                  <Button id="observerCancel" className={classes.button} variant="contained" onClick={() => setObserversForm(false)} color="secondary">
                    {t("cancel")}
                  </Button>
                </form>
              )}
            </div>
            <div style={{
              display: "flex",
              alignItems: "left"
            }}>
              <Typography variant="h6" component="h2" className={classes.obsAndComment}>
                {t("comment")}{": "}{comment}{" "}
              </Typography>
              {commentForm === false ? (
                <IconButton id="commentButton" size="small" onClick={() => setCommentForm(true)} variant="contained" color="primary"  >
                  <EditIcon fontSize="small" />
                </IconButton>
              ) : (
                <form onSubmit={commentOnSubmit}>
                  <TextField
                    className={classes.obsAndComment}
                    id="commentField"
                    variant="outlined"
                    defaultValue={comment}
                    onChange={(event) => setEditedComment(event.target.value)}
                  />
                  <Button id="commentSubmit" className={classes.button} type="submit" variant="contained" color="primary">
                    {t("save")}
                  </Button>
                  <Button id="commentCancel" className={classes.button} variant="contained" onClick={() => setCommentForm(false)} color="secondary">
                    {t("cancel")}
                  </Button>
                </form>
              )}
            </div>
          </Grid>

          {( selectedActions && !actionsEditMode) ?
            <Grid item xs={12} fullwidth="true">
              <FormGroup row className={classes.formGroup}>
                {
                  Object.entries(selectedActions).filter(([key]) => key!=="attachments").map(([action, value], i) =>
                    <FormControlLabel className={classes.formControlLabel}
                      control={ value
                        ? <CheckCircleIcon name="check" fontSize="small" className={classes.checkedDailyAction} color="primary" />
                        : <RemoveCircleOutlineRoundedIcon fontSize="small" className={classes.uncheckedDailyAction} />
                      }
                      label={t(action)} labelPlacement="end" key={i} style={{ cursor: "default" }}
                    />
                  )
                }
                <FormControlLabel className={classes.FormControlLabel}
                  control={<DisabledTextField name="attachments" id="attachments" className={classes.attachment} value={" " + selectedActions.attachments + " " + t("pcs")}
                    disabled InputProps={{ disableUnderline: true }} />}
                  label={<span style={{ color: "rgba(0, 0, 0, 1)" }}>{t("attachments") }</span>} labelPlacement="start" />

                <Box>
                  <IconButton id="actionsButton" size="small" style={{ left: "100px",alignItems: "left" }} onClick={() => handleActionsEditOpen()} variant="contained" color="primary"  >
                    <EditIcon fontSize="medium" />
                  </IconButton>
                </Box>
              </FormGroup>
            </Grid>
            :<Grid item xs={12} fullwidth="true">
              <div style={{
                display: "flex",
                alignItems: "left"
              }}>
                <DailyActions />
                <Button id="actionsEditSave" className={classes.button} variant="contained" onClick={() => handleActionsEditSave()} color="primary">
                  {t("save")}
                </Button>
                <Button id="actionsEditCancel" className={classes.button} variant="contained" onClick={() => handleActionsEditCancel()} color="secondary">
                  {t("cancel")}
                </Button>
              </div>
            </Grid>
          }

          <Grid item xs={6}>
            <Box display="flex" justifyContent="flex-start">
              <Button id="speciesButton" className={classes.button} color="primary" variant="contained" disabled={mode === "table1"} onClick={() => setMode("table1")}>
                {t("summary")}
              </Button>
              <Button id="periodsButton" className={classes.button} color="primary" variant="contained" disabled={mode === "table2"} onClick={() => setMode("table2")}>
                {t("obsPeriods")}
              </Button>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box display="flex" justifyContent="flex-end">
              <Button variant="contained" color="primary" onClick={() => handleOpen()}>
                {t("edit")}
              </Button>{" "}
            </Box>
          </Grid>


          <Grid item xs={12}>
            <ObsPeriodTable
              date={day}
              obsPeriods={obsPeriods}
              summary={summary}
              mode={mode}
              refetchObservations={refetchObservations}
            />

          </Grid>
        </Grid>
        <EditShorthand
          date={day}
          dayId={dayId}
          open={modalOpen}
          handleClose={handleClose}
        />
      </Paper>
    </div>

  );
};

export default DayDetails;