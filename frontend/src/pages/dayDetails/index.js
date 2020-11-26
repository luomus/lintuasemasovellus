import React, { useEffect, useState } from "react";
import { Redirect, useParams } from "react-router-dom";
import {
  Button, IconButton, makeStyles, Paper, Grid, Typography, TextField
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import ObsPeriodTable from "./ObsPeriodTable";
import EditShorthand from "../editShorthand";
// import ObsPeriodTableOther from "./ObsPeriodTableOther";
import {
  getDaysObservationPeriods,
  // getDaysObservationPeriodsOther,
  editComment, editObservers, getSummary
} from "../../services";


const DayDetails = () => {

  const { day, stationName } = useParams();

  const useStyles = makeStyles({
    paper: {
      background: "white",
      padding: "20px 30px",
      margin: "0px 0px 50px 0px",
    },
  });

  const classes = useStyles();
  const { t } = useTranslation();


  const [obsPeriods, setObsperiods] = useState([]);

  const [summary, setSummary] = useState([]);

  // const [obsPeriodsOther, setObsperiodsOther] = useState([]);

  const [observersForm, setObserversForm] = useState(false);

  const [commentForm, setCommentForm] = useState(false);

  const [editedComment, setEditedComment] = useState("");

  const [editedObservers, setEditedObservers] = useState("");

  const [mode, setMode] = useState("table1");

  const [modalOpen, setModalOpen] = useState(false);

  const dayList = useSelector(state => state.days);

  const [observers, setObservers] = useState(
    dayList
      .find(d => d.day === day && d.observatory === stationName)
      .observers
  );

  console.log(observers);

  const [comment, setComment] = useState(dayList
    .find(d => d.day === day && d.observatory === stationName)
    .comment
  );

  const dayId = dayList
    .find(d => d.day === day && d.observatory === stationName)
    .id;

  console.log("OOOOOOOOOOOOOHHHHHHHHHH", day);


  const observersOnSubmit = (event) => {
    event.preventDefault();
    console.log(editedObservers);
    if (editedObservers.length !== 0) {
      console.log(dayId);
      editObservers(dayId, editedObservers);
      setObservers(editedObservers);
    }
    setObserversForm(false);
  };

  const commentOnSubmit = (event) => {
    event.preventDefault();
    console.log(editedComment);
    if (editedComment.length !== 0) {
      editComment(dayId, editedComment);
      setComment(editedComment);
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

  console.log(summary);

  const handleOpen = () => {
    console.log(modalOpen);
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
  };

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

        <Grid container alignItems="flex-start" spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h5" component="h2" >
              {day} {" "}
              {stationName.replace("_", " ")}
            </Typography>
            <Typography variant="h6" component="h2" >
              {t("observers")}{": "}{observers}{" "}
            </Typography>
            {observersForm === false ? (
              <IconButton id="observerButton" size="small" onClick={() => setObserversForm(true)} variant="contained" color="primary"  >
                <EditIcon fontSize="small"/>
              </IconButton>
            ) : (
              <form onSubmit={observersOnSubmit}>
                <TextField
                  id="observerField"
                  variant="outlined"
                  defaultValue={observers}
                  onChange={(event) => setEditedObservers(event.target.value)}
                />
                <Button id="observerSubmit" type="submit" variant="contained" color="primary">
                  {t("save")}
                </Button>
              </form>
            )}
            <Typography variant="subtitle1" component="h2" >
              {t("comment")}{": "}{comment}{" "}
            </Typography>
            {commentForm === false ? (
              <IconButton id="commentButton" size="small" onClick={() => setCommentForm(true)} variant="contained" color="primary"  >
                <EditIcon fontSize="small"/>
              </IconButton>
            ) : (
              <form onSubmit={commentOnSubmit}>
                <TextField
                  id="commentField"
                  variant="outlined"
                  defaultValue={comment}
                  onChange={(event) => setEditedComment(event.target.value)}
                />
                <Button id="commentSubmit" type="submit" variant="contained" color="primary">
                  {t("save")}
                </Button>
              </form>
            )}

          </Grid>

          <Grid item xs={12} align="end">
            <Button variant="contained" color="primary" onClick={() => setMode("table1")}>
              {t("summary")}
            </Button>{" "}
            <Button variant="contained" color="primary" onClick={() => setMode("table2")}>
              {t("obsPeriods")}
            </Button>{" "}
            <Button variant="contained" color="primary" onClick={() => handleOpen()}>
              {t("edit")}
            </Button>{" "}
            <EditShorthand
              date={day}
              dayId={dayId}
              open={modalOpen}
              handleClose={handleClose}
            />
          </Grid>


          <Grid item xs={12}>
            <ObsPeriodTable
              obsPeriods={obsPeriods}
              summary={summary}
              mode={mode}
            />

          </Grid>
        </Grid>
      </Paper>
    </div>

  );
};

export default DayDetails;