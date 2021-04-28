import React, { useState, useEffect } from "react";
import Drawer from "@material-ui/core/Drawer";
import { makeStyles } from "@material-ui/core/styles";
import { AppBar, Toolbar, IconButton, Typography, Box, Button,
  Dialog, DialogTitle, DialogContent, DialogActions,
  FormControl, InputLabel, Select, MenuItem, SvgIcon
} from "@material-ui/core";
import { Dehaze, Replay } from "@material-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import { getLogout, postUserObservatory } from "../services";
import { setUserObservatory } from "../reducers/userObservatoryReducer";
import { setUser } from "../reducers/userReducer";
import store from "../store";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import Header from "./Header";
import NavBarLinks from "./NavBarLinks";


const useStyles = makeStyles((theme) => ({
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
  container: {
    minWidth: 200,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  submit: {
    minWidth: 120,
  },
  observatorySelector: {
    width: "auto",
  },
}));



const NavBar = ({ user }) => {

  const { t } = useTranslation();
  const classes = useStyles();
  const dispatch = useDispatch();

  const [state, setState] = useState({
    right: false
  });
  const [observatory, setObservatory] = useState("");
  const [selectorOpen, setSelectorOpen] = useState(false);

  const userObservatory = useSelector(state => state.userObservatory);
  const stations = useSelector(state => state.stations);

  const observatoryIsSelected = Boolean(userObservatory !== "");

  useEffect(() => {
    if (observatoryIsSelected) {
      setSelectorOpen(false);
    } else {
      setSelectorOpen(true);
    }
  }, [userObservatory]);

  const toggleMenu = (slider, open) => () => {
    setState({ ...state, [slider]: open });
  };

  const handleSelectorClose = () => {
    setSelectorOpen(false);
  };

  const handleSelectorOpen = () => {
    store.dispatch(setUserObservatory(""));
    setSelectorOpen(true);
  };

  const selectUserObservatory = (event) => {
    event.preventDefault();
    postUserObservatory({ observatory:observatory });
    store.dispatch(setUserObservatory(observatory));
  };

  const handleLogout = () => {
    getLogout()
      .then(() => {
        dispatch(setUser({}));
        window.location.reload(false);
      });
  };


  const observatorySelector =
    <Dialog id="observatory-dialog" disableBackdropClick disableEscapeKeyDown open={selectorOpen} onClose={handleSelectorClose}>
      <DialogTitle>{t("chooseObservatory")}</DialogTitle>
      <DialogContent>
        <form id="observatorySelect" onSubmit={selectUserObservatory} className={classes.container}>
          <FormControl required className={classes.formControl}>
            <InputLabel id="Lintuasema">{t("observatory")}</InputLabel>
            <Select
              autoWidth={true}
              labelId="observatory"
              id="select-observatory"
              value={observatory}
              onChange={(event) => setObservatory(event.target.value)}
            >
              {
                stations.map((station, i) =>
                  <MenuItem id={station.observatory.replace(/ /g, "")} value={station.observatory} key={i}>
                    {station.observatory.replace("_", " ")}
                  </MenuItem>
                )
              }
            </Select>
          </FormControl>
        </form>
      </DialogContent>
      <DialogActions>
        <Button id="submit" disabled={!observatory} form="observatorySelect" onClick={handleSelectorClose} color="primary" type="submit">
          {t("save")}
        </Button>
      </DialogActions>
    </Dialog>;

  const observatoryAndUserInfo = () => {
    if (userObservatory !== "") {
      return (
        <Typography className={classes.title}>
          {userObservatory.replace("_", " ")} / {t("User")}: {user.fullName}
        </Typography>
      );
    }
    return (
      <Typography className={classes.title}>
        {t("User")}: {user.fullName}
      </Typography>
    );
  };

  const selectObservatory = observatoryIsSelected
    ?
    <Button className={classes.userButton}
      onClick={handleSelectorOpen}
      id="observatorySelector"
      startIcon={<Replay />}
    >
      {t("Change Observatory")}
    </Button>
    :
    null;

  return (
    <div>
      <AppBar position="static" style={{ background: "#514134" }}>
        <Toolbar>
          <IconButton id="navigationbar" onClick={toggleMenu("right", true)}>
            <Dehaze style={{ color: "white" }} />
          </IconButton>
          <Header />
          <Drawer
            open={state.right}
            onClose={toggleMenu("right", false)}>
            <Box onClick={toggleMenu("right", false)}
              className={classes.drawerContainer} component="div">
              <NavBarLinks />
            </Box>
          </Drawer>
          <section className={classes.rightMenu}>
            {observatorySelector}
            {observatoryAndUserInfo()}
            <Link to='/logout'>
              <Button className={classes.userButton}
                onClick={handleLogout}
                id="logout-link"
                startIcon={<SvgIcon>
                  <path d="M0 0h24v24H0z" fill="none"/>
                  <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
                </SvgIcon>}
              >
                {t("logout")}
              </Button>
            </Link>
            {selectObservatory}
          </section>
        </Toolbar>
      </AppBar>
    </div >
  );
};

export default NavBar;

NavBar.propTypes = {
  user: PropTypes.object
};