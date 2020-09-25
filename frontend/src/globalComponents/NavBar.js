import React, { useState } from "react";
import Drawer from "@material-ui/core/Drawer";
import { makeStyles } from "@material-ui/core/styles";
import { AppBar, Toolbar, IconButton, Typography, Box, Button } from "@material-ui/core";
import { Dehaze, AccountCircle } from "@material-ui/icons";
import NavBarLinks from "./NavBarLinks";
import { loginUrl } from "../constants";
import { useDispatch, useSelector } from "react-redux";
import { getLogout } from "../services/user";
import { setUser } from "../reducers/userReducer";


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
  rightMenu: {
    marginLeft: "auto",
  },
});

const NavBar = () => {
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
      });
  };

  const logoutLogin = user.id
    ?
    <Button className={classes.userButton}

      onClick={logoutHandler}
      href="#"
      id="logout-link"
      startIcon={<AccountCircle />}
    >
      Kirjaudu ulos
    </Button>
    :
    <Button className={classes.userButton}
      id="login-link"
      href={`${loginUrl}`}
      startIcon={<AccountCircle />}
    >
      Kirjaudu sisään
    </Button>;

  const welcomeText = user.id
    ?
    <Typography>
      Tervetuloa sovellukseen {user.fullName}!
    </Typography>
    :
    null;


  return (
    <div>

      <AppBar position="static" style={{ background: "darkolivegreen" }} >
        <Toolbar>
          <IconButton onClick={toggleMenu("right", true)}>
            <Dehaze style={{ color: "white" }} />
          </IconButton>
          <Typography variant="h5">
              Lintuasemasovellus
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
            {welcomeText}
            {logoutLogin}
          </section>
        </Toolbar>
      </AppBar>
    </div >
  );
};

export default NavBar;
