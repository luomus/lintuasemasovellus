import React, { useEffect, useState } from "react";
import {
    Button,
    makeStyles, Paper,
    Snackbar,
    Typography
  } from "@material-ui/core";
  import { useTranslation } from "react-i18next";


const DayDetails = () => { 


  const useStyles = makeStyles({
    paper: {
      background: "red",
      padding: "20px 30px",
      margin: "0px 0px 50px 0px",
    },
  });

  const classes = useStyles();
  const { t } = useTranslation();

  return (
      <div>
          <Paper className={classes.paper}>
            
            <Typography variant="h5" component="h2" >
            {t("observatory")}
            </Typography> 
lässyn lää

          </Paper>
      </div>
    );
  };

export default DayDetails;