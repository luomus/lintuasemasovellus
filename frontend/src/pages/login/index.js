import React, { useEffect, useState } from "react";
import {
  Paper, Button, Grid, Box, Typography
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useTranslation } from "react-i18next";
import { loginUrl } from "../../services";
import { Navigate } from "react-router-dom";
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
    messageBox: {
      marginTop: "1vh",
      color: "red",
      padding: "1em",
    },
  });

  const classes = useStyles();
  const { t } = useTranslation();
  const [message, setMessage] = useState("");

  const user = useSelector(state => state.user);
  const userIsSet = Boolean(user.id);

  if (userIsSet) {
    return (
      <Navigate to="/" />
    );
  }

  useEffect(() => {
    let messageCookie = document?.cookie?.split("; ")?.find(r => r.startsWith("showUserMessage"))?.split("=")[1].replace(/['"]+/g, "");
    if (messageCookie !== undefined) {
      setMessage(messageCookie);
    }
  }, []);

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
          {message && (
            <Grid container alignItems="center" justifyContent="center" item>
              <Box className="box">
                <Paper variant="outlined" className={ classes.messageBox }>
                  <Typography>{t(message)}</Typography>
                  {message === "noRequiredRoles" && (<a href="mailto:halias@halias.fi?cc=helpdesk@laji.fi&subject=Haukka käyttöoikeuspyyntö">halias@halias.fi, cc: helpdesk@laji.fi</a>)}
                </Paper>
              </Box>
            </Grid>
          )}
          <Grid container alignItems="center" justifyContent="center" item xs={12}>

            <Box className="box">
              <br />
              <Button
                size={"large"}
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

          <Grid container alignItems="center" justifyContent="center" item xs={12}>
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
