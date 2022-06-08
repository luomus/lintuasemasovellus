import React, { useEffect, useState } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import { Switch, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { HomePage, UserManual, DayList, DayDetails, Login } from "./pages";
import NavBar from "./globalComponents/NavBar";
import Footer from "./globalComponents/Footer";
import { getPerson, getCurrentUser } from "./services";
import { setUser } from "./reducers/userReducer";
import { setUserObservatory } from "./reducers/userObservatoryReducer";
import { retrieveDays } from "./reducers/daysReducer";
import { initializeStations } from "./reducers/obsStationReducer";
import { makeStyles } from "@material-ui/core/";

const App = () => {

  const useStyles = makeStyles({
    flexi: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      height: "95vh",
      width:"98vw",
    },
    spinner: {
      padding: "0px",
      margin: "60px 60px",
      fontSize: "10px",
      position: "relative",
      borderTop: "1.1em solid lightgrey",
      borderRight: "1.1em solid lightgrey",
      borderBottom: "1.1em solid lightgrey",
      borderLeft: "1.1em solid #2691d9",
      animation: "$spin 1.1s infinite linear",
      "&, :after": {
        borderRadius: "50%",
        width: "10em",
        height: "10em",
      },
    },
    "@keyframes spin": {
      "0%": {
        transform: "rotate(0deg)",
      },
      "100%": {
        transform: "rotate(360deg)",
      },
    },
  });

  const classes = useStyles();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);

  const user = useSelector(state => state.user);
  const userObservatory = useSelector(state => state.userObservatory);

  useEffect(() => {
    console.log(user.id);
    dispatch(initializeStations());
    dispatch(retrieveDays());
    if (user.id) return;
    getPerson().then(response => response.data).then(response => { dispatch(setUser(response)); setLoading(false); }).catch((error) => { console.error("getPerson error", error); setLoading(false); });
  }, [dispatch, user]);

  useEffect(() => {
    getCurrentUser()
      .then(currentUser => {
        const observatory = currentUser.data[0].observatory;
        if (observatory) {
          dispatch(setUserObservatory(observatory));
        }
      });
  }, [user]);

  if (loading) {
    return (
      <div className={classes.flexi}>
        <div className={classes.spinner}>
        </div>
      </div>
    );
  } else if (!user.id && !loading) {
    return (
      <CssBaseline>
        <div>
          <Login />
          <Footer />
        </div>
      </CssBaseline>
    );
  } else if (userObservatory !== "") {
    return (
      <CssBaseline>
        <div>
          <NavBar user={user} />
          <Switch>
            <Route path="/listdays">
              <DayList userObservatory={userObservatory} />
            </Route>
            <Route path="/daydetails/:day">
              <DayDetails userObservatory={userObservatory} />
            </Route>
            <Route path="/manual">
              <UserManual />
            </Route>
            <Route path="/">
              <HomePage user={user} userObservatory={userObservatory} />
            </Route>
          </Switch>
          <Footer />
        </div>
      </CssBaseline>
    );
  } else {
    return (
      <CssBaseline>
        <div>
          <NavBar user={user} />
          <Footer />
        </div>
      </CssBaseline>
    );
  }

};

export default App;
