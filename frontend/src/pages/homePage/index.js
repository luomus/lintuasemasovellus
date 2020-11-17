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
import errorImg from "./error.png";
import "./index.css";
import {
  loopThroughCheckForErrors, getErrors, resetErrors
} from "../../shorthand/validations";
import {
  sendDay, loopThroughObservationPeriods, loopThroughObservations
} from "./parseShorthandField";
import { searchDayInfo } from "../../services";


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
  },
  sendButton: {
    marginBottom: "40px"
  },
  codemirrorBox: {
    position: "relative",
    opacity: "99%"
  }
}));

let timeout = null;

let widgets = new Set();


export const HomePage = () => {
  const classes = useStyles();

  const { t } = useTranslation();

  const formatDate = (date) => {
    const dd = date.getDate();
    const mm = date.getMonth() + 1;
    return `${dd > 9 ? "" : "0"}${dd}.${mm > 9 ? "" : "0"}${mm}.${date.getFullYear()}`;
  };

  const dateNow = new Date();

  const userObservatory = useSelector(state => state.userObservatory);
  const stations = useSelector(state => state.stations);

  const [types, setTypes] = useState([]);
  const [locations, setLocations] = useState([]);

  const [day, setDay] = useState(dateNow);
  const [defaultObservers, setDefaultObservers] = useState("");
  const [defaultComment, setDefaultComment] = useState("");
  const [observers, setObservers] = useState(defaultObservers);
  const [comment, setComment] = useState(defaultComment);
  const [type, setType] = useState("");
  const [location, setLocation] = useState("");
  const [shorthand, setShorthand] = useState("");

  const [formSent, setFormSent] = useState(false);
  const [errorHappened, setErrorHappened] = useState(false);

  const [codeMirrorHasErrors, setCodeMirrorHasErrors] = useState(true);



  const emptyAllFields = () => {
    setDay(dateNow);
    setObservers("");
    setComment("");
    setType("");
    setLocation("");
    setShorthand("");
  };





  useEffect(() => {
    console.log("comment " + comment);
    console.log("defaultcomment " + defaultComment);
    searchDayInfo(formatDate(day), userObservatory).then(dayJson => setDefaultObservers(dayJson[0]["observers"]));
    searchDayInfo(formatDate(day), userObservatory).then(dayJson => setDefaultComment(dayJson[0]["comment"]));
  });



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
      setFormSent(true);
      emptyAllFields();
    } catch (error) {
      console.error(error.message);
      setErrorHappened(true);
    }
  };

  const user = useSelector(state => state.user);
  const userIsSet = Boolean(user.id);

  if (!userIsSet) {
    return (
      <Redirect to="/login" />
    );
  }

  const errorCheckingLogic = async (editor, data, value) => {
    loopThroughCheckForErrors(value);
    for (const widget of widgets) {
      editor.removeLineWidget(widget);
    }
    widgets.clear();
    const errors = getErrors();
    for (let i = 0; i < errors.length; i++) {
      const msg = document.createElement("div");
      const icon = msg.appendChild(document.createElement("img"));
      msg.className = "lint-error";
      icon.setAttribute("src", errorImg);
      icon.className = "lint-error-icon";
      msg.appendChild(document.createTextNode(errors[Number(i)]));
      widgets.add(editor.addLineWidget(data.to.line, msg, {
        coverGutter: false, noHScroll: true
      }));
    }

    if (errors.length === 0) setCodeMirrorHasErrors(false);
    else setCodeMirrorHasErrors(true);
    resetErrors();
  };

  const saveButtonDisabled = () => {
    if (codeMirrorHasErrors || observers === "" || type === "" || location === "")
      return true;
    else
      return false;
  };

  const codemirrorOnchange = (editor, data, value) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      errorCheckingLogic(editor, data, value);
      timeout = null;
    }, 500);
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
              {t("addObservations")}
            </Typography>
            <br />
            <ObservatorySelector />
            <br />
            <Grid container
              alignItems="stretch"
              spacing={1}>

              <Grid item xs={4} sm={5}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    className={classes.datePicker}
                    required
                    disableToolbar
                    invalidDateMessage
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
                  id="shorthand"
                  className={classes.codemirrorBox}
                  value={shorthand}
                  options={{
                    theme: "idea",
                    lineNumbers: true,
                    autoRefresh: true,
                    readOnly: false,
                    lint: false
                  }}
                  editorDidMount={editor => {
                    editor.refresh();
                  }}
                  onBeforeChange={(editor, data, value) => {
                    setShorthand(value);
                  }}
                  onChange={codemirrorOnchange}
                />
              </Grid>
              <Button
                id="saveButton"
                className={classes.sendButton}
                onClick={sendData}
                disabled={saveButtonDisabled()}
                color="primary"
                variant="contained"
              >
                {t("save")}
              </Button>
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper className={classes.paper}>
            <Typography variant="h5" component="h2" >
              {t("observers")}
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