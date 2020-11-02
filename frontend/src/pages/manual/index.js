import React from "react";
import { Paper, Typography } from "@material-ui/core/";
import { makeStyles } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";
import { Redirect } from "react-router-dom";
import { useSelector } from "react-redux";


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


export const UserManual = () => {
  const classes = useStyles();

  const { t } = useTranslation();

  const user = useSelector(state => state.user);
  const userIsSet = Boolean(user.id);

  if (!userIsSet) {
    return (
      <Redirect to="/login" />
    );
  }

  return (
    <div>

      <Paper className={classes.paper}>
        <Typography variant="h5" component="h2" >
          {t("manualTitle")}
        </Typography>
        <br />
        {t("manualText")}</Paper>
    </div>
  );
};

