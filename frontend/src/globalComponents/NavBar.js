import React, { useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import { AppBar, Toolbar, ListItem, IconButton, ListItemText, Avatar, Divider, List, Typography, Box } from "@material-ui/core";
import { Dehaze } from "@material-ui/icons";
import NavBarLinks from "./NavBarLinks";
import { loginUrl } from "../constants";
import { useDispatch, useSelector } from "react-redux";
import { getLogout } from "../services/user";
import { setUser } from "../reducers/userReducer";

const NavBar = () => {

  const [state, setState] = useState({
    right: false
  }
  )

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
    <a
      onClick={logoutHandler}
      href="#"
      id="logout-link"
    >
      Kirjaudu ulos
    </a>
    :
    <a
      id="login-link"
      href={`${loginUrl}`}
    >
      Kirjaudu sisään
    </a>;

  const welcomeText = user.id
    ?
    <li>
      <a>
        Tervetuloa sovellukseen {user.fullName}!
      </a>
    </li>
    :
    null;


  return (
    <div>
      <Box component="navbar">
        <AppBar position="static" style={{ background: "darkolivegreen" }} >
          <Toolbar>
            <IconButton onClick={toggleMenu("right", true)}>
              <Dehaze style={{ color: "white" }} />
            </IconButton>
            <Typography variant="h5">
              Lintuasemasovellus
              </Typography>

            <Drawer open={state.right}
              onClose={toggleMenu("right", false)}>
              <Box onClick={toggleMenu("right", false)} >
                <NavBarLinks />
              </Box>
            </Drawer>
            <ul>
              {welcomeText}
              <br />
              {logoutLogin}
            </ul>
          </Toolbar>
        </AppBar>
      </Box>
      <hr></hr>
    </div>
  );
};

export default NavBar;
