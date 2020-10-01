import React from "react";
import { useState } from "react";
import { postDay } from "../../services";
import Inputfield from "./Inputfield";
import {Paper, Snackbar, Select, TextField, Button, Typography, MenuItem, FormControl, InputLabel} from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from "@material-ui/core/styles";


const useStyles = makeStyles({
  paper: {
    background: "white",
    padding: "20px 30px",
  },
  formControl: {
    margin: "1em",
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: "2em",
  },
});

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export const ObservationSessionForm = () => {
  const [observatory, setObservatory] = useState("");
  const [day, setDay] = useState("");
  const [observers, setObservers] = useState("");
  const [comment, setComment] = useState("");

  const classes = useStyles();

  const addHavainnointi = (event) => {
    event.preventDefault();
    // do things with form
    postDay({ day: day, observers: observers, comment: comment, observatory_id: observatory })
      .then(() => console.log("success"))
      .catch(() => console.error("Error in post request for havainnointiform"));
    setObservatory("");
    setDay("");
    setObservers("");
    setComment("");
  };

  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };



  return (
    <div>
      <Paper className={classes.paper}>
      <Typography variant="h5" component="h2">
        Uusi Päivä
      </Typography>
      <FormControl className={classes.formControl} onSubmit={addHavainnointi}>
        <InputLabel id="Lintuasema">Lintuasema</InputLabel>
        <Select 
          labelId="observatory"
          id ="select"
          value={observatory}
          onChange={(event) => setObservatory(event.target.value)}
          >         
          <MenuItem value ="1">Hangon Lintuasema</MenuItem>
          <MenuItem value ="2">Jurmon Lintuasema</MenuItem>
        </Select>
        <br />
        <TextField required
          id="date-required"
          label="Päivämäärä"
          onChange={(event) => setDay(event.target.value)}
          value={day}
        /><br /> 
        <TextField
          id="observers"
          label="Havainnoija(t)"
          onChange={(event) => setObservers(event.target.value)}
          value={observers}
        /><br /> 
        <TextField
          rows={5}
          id="comment"
          label="Kommentti"
          multiline
          onChange={(event) => setComment(event.target.value)}
          value={comment}
        /><br /> 
        <p><Button variant="contained" color="primary" disableElevation type="submit" onClick={handleClick}>Tallenna</Button></p>
        <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="success">
            Lomake lähetetty!
        </Alert>
        </Snackbar>
      </FormControl>
      </Paper>
    </div>
  );
};
