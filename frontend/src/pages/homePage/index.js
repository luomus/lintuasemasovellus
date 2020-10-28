import React, { useState } from "react";
import { Paper, Grid, Typography, TextField, IconButton } from "@material-ui/core/";
import { makeStyles } from "@material-ui/core/styles";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { useTranslation } from "react-i18next";
import AddIcon from "@material-ui/icons/Add";
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import Tooltip from '@material-ui/core/Tooltip';
import ObservatorySelector from "./observatorySelector"; 
import { useSelector } from "react-redux";
import { getCurrentUser } from "../../services";


const useStyles = makeStyles({
  paper: {
    background: "white",
    padding: "20px 30px",
    margin: "10px 10px 10px 10px"
  },
  card: {
    background: "white",
    margin: "10px 10px 10px 10px"
  },
});


export const HomePage = () => {
  const classes = useStyles();

  const { t } = useTranslation();

  const dateNow = new Date();

  const [day, setDay] = useState(dateNow);
  const [observers, setObservers] = useState("");
  const userObservatory = useSelector(state => state.userObservatory);

  const currentUser = getCurrentUser();
  console.log(currentUser);

  return (
    <div>
      <Grid container
        alignItems="stretch"
        // alignItems="center"
        justify="flex-end"
      >

        <Grid item xs={8}>
          <Paper className={classes.paper}>
            <getCurrentUser />
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
                /><br />
              </Grid>

              <Grid item xs={6} sm={5}>
                Tyyppi
              </Grid>

              <Grid item xs={6} sm={5}>
                Lokaatio
              </Grid>





              <br />
              <br />
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      id="startTime"
                      variant="outlined"
                      label="Alkuaika"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      id="endTime"
                      variant="outlined"
                      label="Loppuaika"
                    />
                  </Grid>
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
                />
              </Grid>
              <Grid item>
                <Tooltip title="Lisää pikakirjoitusrivi" >
                  <IconButton>
                    <AddIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Lisää aikajakso">
                  <IconButton>
                    <AccessTimeIcon />
                  </IconButton>
                </Tooltip>
              </Grid>


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