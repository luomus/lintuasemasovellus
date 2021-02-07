import React, { useEffect } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import NavBar from "./globalComponents/NavBar";
import { Switch, Route } from "react-router-dom";
import { HomePage, UserManual } from "./pages";
import Footer from "./globalComponents/Footer";
import { DayForm, DayList } from "./pages";
import { getAuth, getToken } from "./services";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "./reducers/userReducer";
import { retrieveDays } from "./reducers/daysReducer";
import { initializeStations } from "./reducers/obsStationReducer";
import DayDetails from "./pages/dayDetails";
import Login from "./pages/login";

const App = () => {

  const dispatch = useDispatch();

  const user = useSelector(state => state.user);

  const userIsSet = Boolean(user.id);

  useEffect(() => {
    dispatch(initializeStations());
    dispatch(retrieveDays());
    if (userIsSet) return;
    getToken()
      .then(resp => resp.data)
      .then(tokenJson => getAuth(tokenJson.token, tokenJson.auth_token)
        .then(resp => resp.data)
        .then(res => dispatch(setUser(res)))
        .catch(() => console.error("user not set"))
      ).catch(() => console.error("token not set"));
  }, [dispatch, userIsSet]);

  return (
    <CssBaseline>
      <div>
        <NavBar isLoggedIn={userIsSet} />
        <Switch>
          <Route path="/newday">
            <DayForm />
          </Route>
          <Route path="/listdays">
            <DayList />
          </Route>
          <Route path="/daydetails/:day/:stationName">
            <DayDetails />
          </Route>
          <Route path="/manual">
            <UserManual />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/">
            <HomePage />
          </Route>
        </Switch>
        <Footer />
      </div>
    </CssBaseline>
  );

};

export default App;
