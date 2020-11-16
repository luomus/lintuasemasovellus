import React, { useEffect, useState } from "react";
import { Redirect, useParams } from "react-router-dom";
import {
  Button, IconButton, makeStyles, Paper, Grid, Typography, TextField
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import ObsPeriodTable from "./ObsPeriodTable";
import ObsPeriodTableOther from "./ObsPeriodTableOther";
import {
  getDaysObservationPeriodsStandard, getDaysObservationPeriodsOther,
  editComment, editObservers
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


  const [obsPeriodsStandard, setObsperiodsStandard] = useState([]);

  const [obsPeriodsOther, setObsperiodsOther] = useState([]);

  const [observersForm, setObserversForm] = useState(false);

  const [commentForm, setCommentForm] = useState(false);

  const [editedComment, setEditedComment] = useState("");

  const [editedObservers, setEditedObservers] = useState("");

  const dayList = useSelector(state => state.days);

  const [observers, setObservers] = useState(
    dayList
      .find(d => d.day === day && d.observatory === stationName)
      .observers
  );

  const [comment, setComment] = useState(dayList
    .find(d => d.day === day && d.observatory === stationName)
    .comment
  );

  const dayId = dayList
    .find(d => d.day === day && d.observatory === stationName)
    .id;


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
    getDaysObservationPeriodsStandard(dayId)
      .then(periodsJson => setObsperiodsStandard(periodsJson));
  }, [dayId]);

  useEffect(() => {
    getDaysObservationPeriodsOther(dayId)
      .then(periodsJson => setObsperiodsOther(periodsJson));
  }, [dayId]);

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

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h5" component="h2" >
              {day} {" "}
              {stationName.replace("_", " ")}
            </Typography>
            <Typography variant="h6" component="h2" >
              {t("observers")}{": "}{observers}{" "}
            </Typography>
            {observersForm === false ? (
              <IconButton id="observerButton" onClick={() => setObserversForm(true)} variant="contained" color="primary"  >
                <EditIcon />
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
              <IconButton id="commentButton" onClick={() => setCommentForm(true)} variant="contained" color="primary"  >
                <EditIcon />
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

          <Grid item xs={12}>
            <Button variant="contained" color="primary">
              {t("newPeriod")}
            </Button>{" "}
          </Grid>


          <Grid item xs={6}>
            <Typography variant="h6" >
              {t("vakioTitle")}
            </Typography>

            <ObsPeriodTable
              obsPeriods={obsPeriodsStandard}
            />

          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6" >
              {t("otherTitle")}
            </Typography>

            <ObsPeriodTableOther
              obsPeriods={obsPeriodsOther}
            />

          </Grid>
        </Grid>
      </Paper>
    </div>

  );
};

export default DayDetails;