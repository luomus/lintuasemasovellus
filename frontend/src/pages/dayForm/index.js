import React, { useState } from "react";
import { postDay } from "../../services";
import {
  Paper, Snackbar,
  Select, TextField, Button,
  Typography, MenuItem,
  FormControl, InputLabel
} from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core/styles";
import ObsStation from "../../globalComponents/ObsStation";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { useTranslation } from "react-i18next";


const useStyles = makeStyles({
  paper: {
    background: "white",
    padding: "20px 30px",
    margin: "0px 0px 50px 0px",
  },
  root: {
    "& .MuiFormControl-root": {
      width: "40%",
      margin: "1em"
    }
  },
});

const Alert = (props) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
};


export const DayForm = () => {

  const { t } = useTranslation();

  const dateNow = new Date();

  const [observatory, setObservatory] = useState("");
  const [day, setDay] = useState(dateNow);
  const [observers, setObservers] = useState("");
  const [comment, setComment] = useState("");
  const [location, setLocation] = useState("");
  const [observationperiod, setObservationperiod] = useState("");
  const [observation, setObservation] = useState("");

  const classes = useStyles();
  const [formSent, setFormSent] = useState(false);
  const [errorHappened, setErrorHappened] = useState(false);


  const formatDate = (date) => {
    const dd = date.getDate();
    const mm = date.getMonth() + 1;
    return `${dd > 9 ? "" : "0"}${dd}.${mm > 9 ? "" : "0"}${mm}.${date.getFullYear()}`;
  };

  const addDay = (event) => {
    event.preventDefault();
    // do things with form
    postDay({
      day: formatDate(day),
      observers: observers,
      comment: comment,
      observatory_id: observatory,
      location: location,
      observationperiod: observationperiod,
      observation: observation
    })
      .then((res) => {
        if (res.status !== 200) {
          setErrorHappened(true);
        } else {
          setFormSent(true);
          setObservatory("");
          setDay(dateNow);
          setObservers("");
          setComment("");
          setLocation("");
          setObservationperiod("");
          setObservation("");
        }
      })
      .catch(() => setErrorHappened(true));
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setFormSent(false);
    setErrorHappened(false);
  };

  return (
    <div>
      <Paper className={classes.paper}>
        <Typography variant="h5" component="h2">
          {t("newDay")}
        </Typography>
        <form className={classes.root} onSubmit={addDay}>
          <FormControl>
            <InputLabel id="Lintuasema">{t("observatory")} *</InputLabel>
            <Select required
              labelId="observatory"
              id="select"
              value={observatory}
              onChange={(event) => setObservatory(event.target.value)}
            >
              <MenuItem id="testStation" value="1">
                <ObsStation id={1} />
              </MenuItem>
              <MenuItem value="2">
                <ObsStation id={2} />
              </MenuItem>
            </Select>
          </FormControl>
          <br />
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              required
              disableToolbar
              variant="inline"
              format="dd.MM.yyyy"
              margin="normal"
              id="date-picker-inline"
              label={t("date")}
              value={day}
              onChange={(date) => setDay(date)}
              KeyboardButtonProps={{
                "aria-label": "change date",
              }}
            />
          </MuiPickersUtilsProvider>
          <br />

          <TextField required
            id="observers"
            label={t("observers")}
            onChange={(event) => setObservers(event.target.value)}
            value={observers}
          /><br />
          <TextField
            id="location"
            label={t("location")}
            onChange={(event) => setLocation(event.target.value)}
            value={location}
          /><br />
          <TextField
            id="observationperiod"
            label={t("observationperiod")}
            onChange={(event) => setObservationperiod(event.target.value)}
            value={observationperiod}
          /><br />
          <TextField
            id="observation"
            label={t("observation")}
            onChange={(event) => setObservation(event.target.value)}
            value={observation}
          /><br />
          <TextField
            rows={5}
            id="comment"
            label={t("comment")}
            multiline
            onChange={(event) => setComment(event.target.value)}
            value={comment}
          /><br />
          <p>
            <Button
              variant="contained"
              color="primary"
              disableElevation type="submit" >
              {t("save")}
            </Button>
          </p>
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
        </form>
      </Paper>
    </div>
  );
};
