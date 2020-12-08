import React from "react";
import {
  Paper, makeStyles, Button, Grid, Box
} from "@material-ui/core/";
import { useTranslation } from "react-i18next";
import { loginUrl } from "../../services";
import { AccountCircle } from "@material-ui/icons";
import { Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
import banner from "../../resources/banner.png";
import luomuslogo from "../../resources/luomuslogo.png";

export const Login = () => {

  const useStyles = makeStyles({
    root: {
      display: "flex",
      justifyContent: "center",
    },
    paper: {
      background: "white",
      //padding: "20px 30px",
      margin: "10px 10px 10px 10px",
      width: "60%",
    },
    userButton: {
      color: "black",
      float: "right",
      size: "small",
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
    haukkaLogo: {
      float: "center",
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
          <Grid item xs={12}>
            <Button
              className={classes.userButton}
              id="login-link"
              href={loginUrl}
              startIcon={<AccountCircle />}
            >
              {t("login")}
            </Button>
          </Grid>

          <Grid item xs={12}>

            <Box p={4}>
              <br />
              {t("intro")}
            </Box>
          </Grid>

          <Grid container alignItems="center" justify="center" item xs={12}>
            <Box className="logoBox" p={2}>
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

export default Login;