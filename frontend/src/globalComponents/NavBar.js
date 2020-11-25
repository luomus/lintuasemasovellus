import React, { useState } from "react";
import Drawer from "@material-ui/core/Drawer";
import { makeStyles } from "@material-ui/core/styles";
import { AppBar, Toolbar, IconButton, Typography, Box, Button } from "@material-ui/core";
import { Dehaze, AccountCircle } from "@material-ui/icons";
import NavBarLinks from "./NavBarLinks";
import { useDispatch, useSelector } from "react-redux";
import { getLogout, loginUrl } from "../services";
import { setUser } from "../reducers/userReducer";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";


const useStyles = makeStyles({
  drawerContainer: {
    background: "white",
    padding: "20px 30px",
  },
  userButton: {
    float: "right",
    size: "small",
    color: "white",
    backgroundColor: "olivegreen",

  },
  title: {
    color: "white",
    textDecoration: "none",
  },
  rightMenu: {
    marginLeft: "auto",
  },
});



const NavBar = () => {
  const { t } = useTranslation();

  const classes = useStyles();

  const [state, setState] = useState({
    right: false
  }
  );

  const toggleMenu = (slider, open) => () => {
    setState({ ...state, [slider]: open });
  };

  const user = useSelector(state => state.user);

  const dispatch = useDispatch();

  const logoutHandler = () => {
    getLogout()
      .then(() => {
        dispatch(setUser({}));
        window.location.reload(false);
      });
  };


  const logoutLogin = user.id
    ?
    <Link to='/logout'>
      <Button className={classes.userButton}

        onClick={logoutHandler}

        id="logout-link"
        startIcon={<AccountCircle />}
      >
        {t("logout")}
      </Button>
    </Link>
    :
    <Button className={classes.userButton}
      id="login-link"
      href={loginUrl}
      startIcon={<AccountCircle />}
    >
      {t("login")}
    </Button>;

  const welcomeText = user.id
    ?
    <Typography color="secondary">
      {t("welcome")}, {user.name}!
    </Typography>
    :
    null;

  const userIsSet = Boolean(user.id);

  if (!userIsSet) {
    return (
      <div>

      </div>
    );
  }
  return (
    <div>

      <AppBar position="static" style={{ background: "#514134" }}>
        <Toolbar>
          <IconButton id="navigationbar" onClick={toggleMenu("right", true)}> {/*navigationbar nimi lisätty testejä varten, että löytyy helpommin*/}
            <Dehaze style={{ color: "white" }} />
          </IconButton>
          <Typography component={Link} to="/" variant="h5" className={classes.title}>
            {t("title")}
          </Typography>
          <Drawer
            open={state.right}
            onClose={toggleMenu("right", false)}>
            <Box onClick={toggleMenu("right", false)}
              className={classes.drawerContainer} component="div">
              <NavBarLinks />
            </Box>
          </Drawer>
          <section className={classes.rightMenu}>
            {welcomeText}{logoutLogin}
          </section>
        </Toolbar>
      </AppBar>
    </div >
  );
};

export default NavBar;
