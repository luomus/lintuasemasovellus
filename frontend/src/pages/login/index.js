import React from "react";
import {
  Paper, makeStyles, Button, Grid, Box, Typography
} from "@material-ui/core/";
import { useTranslation } from "react-i18next";
import { loginUrl } from "../../services";
import { Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
import banner from "../../resources/banner.png";
import luomuslogo from "../../resources/luomuslogo.png";
import haukkalogo from "../../resources/haukka-logo-circle.svg";

export const Login = () => {

  const useStyles = makeStyles({
    root: {
      display: "flex",
      justifyContent: "center",
    },
    paper: {
      background: "white",
      margin: "20px 10px 10px 10px",
      width: "50%",
    },
    userButton: {
      color: "black",
      align: "center",
    },
    banner: {
      width: "100%"
    },
    luomusLogo: {
      width: "20%",
      align: "center",
    },
    box: {
      justifyContent: "center",
      margin: "0 auto",
      align: "center",
    },
    logoBox: {
      height: "100px",
      width: "100px",
      position: "relative",
      left: "50%",
      marginLeft: "-50px",
      top: "30%",
      marginTop: "-50px",
    },
    haukkaLogo: {
      align: "center",
      height: "20px",


    },
  });

  const classes = useStyles();
  const { t } = useTranslation();

  const user = useSelector(state => state.user);
  const userIsSet = Boolean(user.id);

  if (userIsSet) {
    return (
      <Redirect to="/" />
    );
  }

  return (
    <div className={classes.root}>

      <Paper className={classes.paper} square={false}>
        <Grid container>
          <Grid item xs={12}>
            <img className={classes.banner}
              src={banner}
              alt="banneri"></img>
          </Grid>
          <Box className={classes.logoBox}>
            <img
              src={haukkalogo}
              width="100"
              alt="haukka"></img>
          </Box>
          <Grid container alignItems="center" justify="center" item xs={12}>

            <Box className="box">
              <br />
              <Button
                variant="contained"
                className={classes.userButton}
                id="login-link"
                href={loginUrl}
              >
                <Typography>{t("login")}</Typography>
              </Button>
            </Box>
          </Grid>


          <Grid item xs={12}>

            <Box p={4}>
              <br />
              {t("intro")}
            </Box>
          </Grid>

          <Grid container alignItems="center" justify="center" item xs={12}>
            <Box className="box" p={2}>
              <br />
              <br />
              <a href="https://www.luomus.fi/">
                <img
                  src={luomuslogo}
                  width="200"
                  alt="luomus"></img>
                <br />
              </a>
            </Box>
          </Grid>
        </ Grid>
      </Paper>

    </div>
  );
};