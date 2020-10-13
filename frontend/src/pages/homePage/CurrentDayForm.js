import React, { useState } from "react";
import { postDay } from "../../services";
import {
  //Paper,
  Snackbar,
  Select, TextField, Button,
  Typography, MenuItem,
  FormControl, InputLabel
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";
import Alert from "../../globalComponents/Alert";


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



const CurrentDayForm = () => {

  const { t } = useTranslation();

  const dateNow = new Date();

  const [observatory, setObservatory] = useState("");
  const [day, setDay] = useState(dateNow);
  const [observers, setObservers] = useState("");
  const [comment, setComment] = useState("");

  const classes = useStyles();

  const [formSent, setFormSent] = useState(false);
  const [errorHappened, setErrorHappened] = useState(false);


  const formatDate = (date) => {
    const dd = date.getDate();
    const mm = date.getMonth() + 1;
    return `${dd > 9 ? "" : "0"}${dd}.${mm > 9 ? "" : "0"}${mm}.${date.getFullYear()}`;
  };
  const today = formatDate(dateNow);

  const addDay = (event) => {
    event.preventDefault();
    // do things with form
    postDay({
      day: formatDate(day),
      observers: observers,
      comment: comment,
      observatory_id: observatory,
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

      <br />
      <Typography variant="h5" component="h2" >
        {today}
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
              {"testestes"}
            </MenuItem>
            <MenuItem value="2">
              {"testestet"}
            </MenuItem>
          </Select>
        </FormControl>
        <br />

        <TextField required
          id="observers"
          label={t("observers")}
          onChange={(event) => setObservers(event.target.value)}
          value={observers}
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
                        Lisää päivä
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
    </div>
  );
};
export default CurrentDayForm;