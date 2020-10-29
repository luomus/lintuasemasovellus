import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, makeStyles, Paper, Grid, Snackbar, Typography, TextField } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import ObsPeriodTable from "./ObsPeriodTable";
import ObsPeriodTableOther from "./ObsPeriodTableOther";
import {
  getDaysObservationPeriods, postObservationPeriod,
  getDaysObservationPeriodsStandard, getDaysObservationPeriodsOther,
  editComment, editObservers
} from "../../services";
import { Link } from "react-router-dom";


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

  const [errorHappened, setErrorHappened] = useState(false);


  const dayList = useSelector(state => state.days);


  const observersOnSubmit = (event) => {
    event.preventDefault()
    console.log(editedObservers)
    console.log(dayId)
    editObservers({
      dayId: dayId, 
      observers: editedObservers})
      .then((res) => {
        if (res.status !== 200) {
          setErrorHappened(true);
        } else {
          setEditedObservers("");
        }
      })
      .catch(() => setErrorHappened(true));
    setObserversForm(false)
  }
  
  
  const commentOnSubmit = (event) => {
    event.preventDefault()
    console.log(editedComment)
    editObservers({
      dayId: dayId, 
      comment: editedComment})
    setCommentForm(false)
  }


  // useEffect(() => {
  //   getDaysObservationPeriods(dayId, observationType)
  //     .then(periodsJson => setObsperiods(periodsJson));
  // }, [formSent, dayId]);

  // useEffect(() => {
  //   getDaysObservationPeriods(dayId, observationType2)
  //     .then(periodsJson2 => setObsperiods2(periodsJson2));
  // }, [formSent, dayId]);

  useEffect(() => {
    getDaysObservationPeriodsStandard(dayId)
      .then(periodsJson => setObsperiodsStandard(periodsJson));
  }, [dayId]);

  useEffect(() => {
    getDaysObservationPeriodsOther(dayId)
      .then(periodsJson => setObsperiodsOther(periodsJson));
  }, [dayId]);

  if (!dayList) return null;

  const dayId = dayList
    .find(d => d.day === day && d.observatory === stationName)
    .id;

  const comment = dayList
    .find(d => d.day === day && d.observatory === stationName)
    .comment;

  const observers = dayList
    .find(d => d.day === day && d.observatory === stationName)
    .observers;



  return (

    <div>
      <Paper className={classes.paper}>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h5" component="h2" >
              {day} {" "}
              {stationName}
            </Typography>
            <Typography variant="h6" component="h2" >
              {t("observers")}{": "}{observers}{" "}
            </Typography>
            {observersForm === false ? (
              <Button onClick={() => setObserversForm(true)} variant="contained" color="primary"  >
                Muokkaa havainnoitsijoita
              </Button>
            ) : (

                <form onSubmit={observersOnSubmit}>
                  <TextField 
                    id="outlined-basic" 
                    variant="outlined"
                    onChange={(event) => setEditedObservers(event.target.value)}
                     />
                  <Button type="submit" variant="contained" color="primary">
                    Tallenna
                </Button>
                </form>
              )}





            <Typography variant="subtitle1" component="h2" >
              {t("comment")}{": "}{comment}{" "}
            </Typography>
            {commentForm === false ? (
              <Button onClick={() => setCommentForm(true)} variant="contained" color="primary"  >
                Muokkaa kommenttia
              </Button>
            ) : (
                <form onSubmit={commentOnSubmit}>
                  <TextField 
                    id="outlined-basic" 
                    variant="outlined" 
                    onChange={(event) => setEditedComment(event.target.value)}
                    />
                  <Button type="submit" variant="contained" color="primary">
                    Tallenna
                </Button>
                </form>
              )}



          </Grid>

          <Grid item xs={12}>

            <Button variant="contained" color="primary">
              Lisää jakso
            </Button>{" "}
            <Button variant="contained" color="primary" component={Link} to={`/daydetails2/${day}/${stationName}`}>
              Yllätysnappi
            </Button>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="h6" >
              Vakiomuutonseuranta
          </Typography>

            <ObsPeriodTable
              obsPeriods={obsPeriodsStandard}
            />

          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6" >
              Muu havainnointi
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