import React from "react";
import { Paper, Typography } from "@material-ui/core/";
import { makeStyles } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";


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

