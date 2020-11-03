import React, {
  useEffect,
  useState
} from "react";
import {
  Paper,
  Grid,
  Typography, TextField, Button,
  FormControl, InputLabel, Select, MenuItem
} from "@material-ui/core/";
import { makeStyles } from "@material-ui/core/styles";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { useTranslation } from "react-i18next";
import ObservatorySelector from "./observatorySelector";
import { useSelector } from "react-redux";
import {
  sendDay, loopThroughObservationPeriods, loopThroughObservations
} from "./parseShorthandField";
import { Redirect } from "react-router-dom";


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
  datePicker: {
  }
}));


export const HomePage = () => {
  const classes = useStyles();

  const { t } = useTranslation();

  const dateNow = new Date();

  const [day, setDay] = useState(dateNow);
  const [observers, setObservers] = useState("");
  const [comment, setComment] = useState("");
  const [shorthand, setShorthand] = useState("");
  const userObservatory = useSelector(state => state.userObservatory);
  const stations = useSelector(state => state.stations);

  const [type, setType] = useState("");

  const [location, setLocation] = useState("");

  const [types, setTypes] = useState(["test"]);

  const [locations, setLocations] = useState(["test"]);

  console.log("stations");
  console.log(stations);

  console.log("user observatory");
  console.log(userObservatory);






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


  console.log("types and locations");
  console.log(type);
  console.log(location);

  const formatDate = (date) => {
    const dd = date.getDate();
    const mm = date.getMonth() + 1;
    return `${dd > 9 ? "" : "0"}${dd}.${mm > 9 ? "" : "0"}${mm}.${date.getFullYear()}`;
  };

  const sendData = async () => {
    const shorthandRows = shorthand.split("\n");
    try {
      await sendDay({
        day: formatDate(day),
        comment: comment,
        observers,
        observatory: userObservatory
      });
      await loopThroughObservationPeriods(shorthandRows, type, location);
      await loopThroughObservations(shorthandRows);
    } catch (error) {
      console.error("Error in shorthand textfield parsing:", error);
    }
  };


  const user = useSelector(state => state.user);
  const userIsSet = Boolean(user.id);
  console.log("user is set: " + userIsSet);

  if (!userIsSet) {
    return (
      <Redirect to="/login" />
    );
  }

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
            <ObservatorySelector />
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
                    id="select"
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
                    id="select"
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
                <TextField required
                  id="shorthand"
                  variant="outlined"
                  label="Pikakirjoitus"
                  fullWidth={true}
                  multiline={true}
                  rows={5}
                  value={shorthand}
                  onChange={(event) => setShorthand(event.target.value)}
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
            lorem ipsum jne
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};