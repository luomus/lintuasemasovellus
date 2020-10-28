import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, makeStyles, Paper, Grid, Snackbar, Typography, TextField } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import ObsPeriodTable from "./ObsPeriodTable";
import ObsPeriodTableOther from "./ObsPeriodTableOther";
import { getDaysObservationPeriods, postObservationPeriod } from "../../services";
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
  const [formSent, setFormSent] = useState(false);


  const [obsPeriods, setObsperiods] = useState([]);

  
  const [obsPeriods2, setObsperiods2] = useState([]);

  const [observersForm, setObserversForm] = useState(false);

  const [commentForm, setCommentForm] = useState(false);

  const state = {
    obsPeriods, setObsperiods,
    obsPeriods2, setObsperiods2,
    commentForm, setCommentForm,
    observersForm, setObserversForm
  };


  const observersOnSubmit = (event) => {
    event.preventDefault()
    console.log('button clicked', event.target)
    setObserversForm(false)
  }
  

  const commentOnSubmit = (event) => {
    event.preventDefault()
    console.log('button clicked', event.target)
    setCommentForm(false)
  }

 

  const dayList = useSelector(state => state.days);

  const dayId = dayList
    .find(d => d.day === day && d.observatory === stationName)
    .id;

  const comment = dayList
    .find(d => d.day === day && d.observatory === stationName)
    .comment;

  const observers = dayList
    .find(d => d.day === day && d.observatory === stationName)
    .observers;

  const observationType = "Vakio";
  const observationType2 = "Paikallishavainto";

  useEffect(() => {
    getDaysObservationPeriods(dayId, observationType)
      .then(periodsJson => setObsperiods(periodsJson));
  }, [formSent, dayId]);

  useEffect(() => {
    getDaysObservationPeriods(dayId, observationType2)
      .then(periodsJson2 => setObsperiods2(periodsJson2));
  }, [formSent, dayId]);

  console.log("jaksot:" + obsPeriods);


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
                <TextField id="outlined-basic" variant="outlined" />
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
                <TextField id="outlined-basic" variant="outlined" />
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
              obsPeriods={obsPeriods}
            />

          </Grid>

          <Grid item xs={6}>
            <Typography variant="h6" >
              Muu havainnointi
          </Typography>

            <ObsPeriodTableOther
              obsPeriods={obsPeriods2}
            />

          </Grid>
        </Grid>
      </Paper>
    </div>

  );
};










export default DayDetails;