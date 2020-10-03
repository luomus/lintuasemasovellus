import React from "react";
import { Paper, Grid } from "@material-ui/core/";
import { makeStyles } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";



const useStyles = makeStyles({
  paper: {
    background: "white",
    padding: "20px 30px",
  },
});



export const HomePage = () => {
  const classes = useStyles();

  const { t } = useTranslation();


  return (
    <div>

      <Grid container spacing={10}>
        <Grid item xs={12} sm={6}>
          <Paper className={classes.paper}>
            {t("intro")}
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

