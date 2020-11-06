import React, {
  useEffect,
  useState
} from "react";
import {
  Paper,
  Grid,
  Typography, TextField, Button,
  FormControl, InputLabel, Select, MenuItem, Snackbar
} from "@material-ui/core/";
import { makeStyles } from "@material-ui/core/styles";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { useTranslation } from "react-i18next";
import ObservatorySelector from "./observatorySelector";
import { useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import Alert from "../../globalComponents/Alert";

import { Controlled as CodeMirror } from "react-codemirror2";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/idea.css";
import {
  checkWholeInputLine, getErrors, resetErrors, isTime, timelines
} from "./validations";
import {
  sendDay, loopThroughObservationPeriods, loopThroughObservations
} from "./parseShorthandField";


const useStyles = makeStyles((theme) => ({
  paper: {
    background: "white",
    padding: "20px 30px",
    margin: "10px 10px 10px 10px"
  },
  card: {
    background: "white",
    margin: "10px 10px 10px 10px"
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  }
}));


export const HomePage = () => {
  const classes = useStyles();

  const { t } = useTranslation();

  const dateNow = new Date();

  const [day, setDay] = useState(dateNow);
  const [observers, setObservers] = useState("");
  const [comment, setComment] = useState("");

  const userObservatory = useSelector(state => state.userObservatory);
  const stations = useSelector(state => state.stations);

  const [type, setType] = useState("");

  const [location, setLocation] = useState("");

  const [types, setTypes] = useState(["test"]);

  const [locations, setLocations] = useState(["test"]);

  const [formSent, setFormSent] = useState(false);
  const [errorHappened, setErrorHappened] = useState(false);

  const [shorthand, setShorthand] = useState("");

  const formatDate = (date) => {
    const dd = date.getDate();
    const mm = date.getMonth() + 1;
    return `${dd > 9 ? "" : "0"}${dd}.${mm > 9 ? "" : "0"}${mm}.${date.getFullYear()}`;
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setFormSent(false);
    setErrorHappened(false);
  };

  useEffect(() => {
    if (Object.keys(userObservatory).length !== 0) {
      setTypes(
        stations
          .find(s => s.observatory === userObservatory)
          .types
      );
    }
  });

  useEffect(() => {
    if (Object.keys(userObservatory).length !== 0) {
      setLocations(
        stations
          .find(s => s.observatory === userObservatory)
          .locations
      );
    }
  });
  /*
  const handleModalClose = () => {
    setShowModal(false);
  };


  const showFeedback = () => {
    setShowModal(true);
  };
  */

  const sendData = async () => {
    const rows = shorthand.split("\n");
    try {
      await sendDay({
        day: formatDate(day),
        comment,
        observers,
        observatory: userObservatory
      });
      await loopThroughObservationPeriods(rows, type, location);
      await loopThroughObservations(rows);
    } catch (error) {
      console.error(error.message);
    }
  };

  const user = useSelector(state => state.user);
  const userIsSet = Boolean(user.id);
  console.log("user is set: " + userIsSet);

  console.log("shorthand val:", shorthand);

  if (!userIsSet) {
    return (
      <Redirect to="/login" />
    );
  }

  const errorChecking = (editor, data, value) => {
    setShorthand(value);
    const lines = editor.doc.children[0].lines;
    console.log("lines:", lines);
    console.log("data:", data);
    if (lines.length > 1 && data.to.line < lines.length - 1) {
      const text = lines[data.to.line].text;
      if (!text) return;
      else if (isTime(text)) {
        timelines.add(data.to.line);
        console.log(timelines);
      } else {
        checkWholeInputLine(data.to.line, lines[data.to.line].text);
      }
      const errors = getErrors();
      console.log("errors:", errors);
      resetErrors();
    } else {
      return;
    }
  };

  return (
    <div>
      <Grid container
        alignItems="stretch"
        // alignItems="center"
        justify="flex-end"
      >

        <Grid item xs={8}>
          <Paper className={classes.paper}>
            <Typography variant="h5" component="h2" >
              Lisää havaintoja
            </Typography>
            <br />
            <ObservatorySelector  />
            <br />
            {console.log("valittu asema on " + userObservatory)}
            <Grid container
              alignItems="stretch"
              spacing={1}>

              <Grid item xs={4} sm={5}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    className={classes.datePicker}
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
              </Grid>

              <Grid item xs={4} sm={5}>
                <TextField required
                  id="observers"
                  label={t("observers")}
                  onChange={(event) => setObservers(event.target.value)}
                  value={observers}
                />
              </Grid>

              <Grid item xs={12} sm={12}>
                <TextField
                  rows={2}
                  multiline={true}
                  id="comment"
                  label={t("comment")}
                  onChange={(event) => setComment(event.target.value)}
                  value={comment}
                />
              </Grid>

              <Grid item >
                <FormControl className={classes.formControl}>
                  <InputLabel id="Tyyppi">{t("type")}</InputLabel>
                  <Select required
                    labelId="type"
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
              </Grid>{" "}
              <Grid item >
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


              <br />
              <br />
              <Grid item xs={12}>
                <Grid container spacing={2}>
                </Grid>
                <br />
              </Grid>

              <Grid item xs={12}>
                <CodeMirror
                  value={shorthand}
                  options={{
                    theme: "idea",
                    lineNumbers: true,
                    autoRefresh: true,
                  }}
                  editorDidMount={editor => {
                    editor.refresh();
                  }}
                  onBeforeChange={(editor, data, value) => {
                    setShorthand(value);
                  }}
                  onChange={errorChecking}
                />
              </Grid>
              <Button onClick={sendData}>
                {t("save")}
              </Button>
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper className={classes.paper}>
            <Typography variant="h5" component="h2" >
              Käyttöohjeet
            </Typography>
            <br />
            Syötä havainto pikakirjoitusmuodossa:
            <br />
            <br />
            10:00
            <br />
            sommol 1/2 W
            <br />
            12:00
          </Paper>
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
    </div>
  );
};