import React, { useEffect } from "react";
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

const App = () => {

  const dispatch = useDispatch();

  const user = useSelector(state => state.user);
  const userObservatory = useSelector(state => state.userObservatory);

  useEffect(() => {
    dispatch(initializeStations());
    dispatch(retrieveDays());
    if (user.id) return;
    /*getToken()
      .then(resp => resp.data)
      .then(tokenJson => getAuth(tokenJson.token, tokenJson.auth_token)
        .then(resp => resp.data)
        .then(res => dispatch(setUser(res)))
        .catch(() => console.error("user not set"))
      ).catch(() => console.error("token not set"));*/
    getPerson().then(response => response.data).then(response => dispatch(setUser(response))).catch((error) => console.error("getPerson error", error));
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

  if (!user.id) {
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
