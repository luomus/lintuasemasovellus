import React from "react";
import { Paper, Grid } from "@material-ui/core/";
import { makeStyles } from "@material-ui/core/styles";


const useStyles = makeStyles({
  paper: {
    background: "white",
    padding: "20px 30px",
  },
});



export const HomePage = () => {
  const classes = useStyles();

  return (
    <div>
      <Grid container spacing={40}>
        <Grid item xs={12} sm={6}>
          <Paper className={classes.paper}>
            Tämä on täytetekstiä. Suomessa sijaitsee 16 lintuasemaa.
            Lintuasemasovelluksen avulla käyttäjä voi kirjata lintuasemilla tehtyjä
            lintujen havaintotietoja vakioidussa muodossa. Havaintojen tallentaminen järjestelmään vaatii
            sisäänkirjautumisen.
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

