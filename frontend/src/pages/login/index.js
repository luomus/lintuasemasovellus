import React from "react";
import {
  Paper, makeStyles, Button, Grid, Box, Icon
} from "@material-ui/core/";
import { useTranslation } from "react-i18next";
import { loginUrl } from "../../services";
//import { AccountCircle } from "@material-ui/icons";
import { Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
import banner from "../../resources/banner.png";
import luomuslogo from "../../resources/luomuslogo.png";
//import haukkalogo from "../../resources/haukkalogo_black.png";
import haukkaicon from "../../resources/haukka_icon.png";
import banana from "../../resources/banana.gif";

export const Login = () => {

  const useStyles = makeStyles({
    root: {
      display: "flex",
      justifyContent: "center",
    },
    paper: {
      background: "white",
      padding: "20px 30px",
      margin: "10px 10px 10px 10px",
      width: "70%",
    },
    userButton: {
      float: "right",
      size: "small",
      color: "black",
    },
    banner: {
      width: "100%"
    },
    luomusLogo: {
      width: "20%",
      align: "center",
    },
    logoBox: {
      justifyContent: "center",
      margin: "0 auto",
      align: "center",
    },
    haukkaIcon: {
      width: "20%"

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
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <img className={classes.banner}
              src={banner}
              alt="banneri"></img>
          </Grid>
          <Grid item xs={12}>
            <img
              className={classes.haukkaIcon}
              src={haukkaicon}
              alt="haukka"
            >
            </img>
            <img
              className={classes.haukkaIcon}
              src={banana}
              alt="banana"
            >
            </img>
            <Button
              className={classes.userButton}
              id="login-link"
              href={loginUrl}
              startIcon={<Icon><img src={haukkaicon} /></Icon>}
            >
              {t("login")}
            </Button>
          </Grid>

          <Grid item xs={12}>
            {t("intro")}
          </Grid>

          <Grid container alignItems="center" justify="center" item xs={12}>
            <Box className="logoBox">
              <a href="https://www.luomus.fi/">
                <img
                  className={classes.luomusLogo}
                  src={luomuslogo}
                  alt="luomus"></img>
              </a>
            </Box>
          </Grid>
        </ Grid>
      </Paper>

    </div>
  );
};

export default Login;