import React, { useEffect } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import NavBar from "./globalComponents/NavBar";
import { Switch, Route } from "react-router-dom";
import { HomePage } from "./pages";
import Footer from "./globalComponents/Footer";
import { Form, ObservationSessionForm, ObservationSessionList, HavaintoList } from "./pages";
import { getAuth, getToken } from "./services";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "./reducers/userReducer";

const App = () => {

  const dispatch = useDispatch();

  const user = useSelector(state => state.user);

  const userIsSet = Boolean(user.id);

  useEffect(() => {
    if (userIsSet) return;
    getToken()
      .then(resp => resp.data)
      .then(tokenJson => getAuth(tokenJson.token, tokenJson.auth_token)
        .then(resp => resp.data)
        .then(res => dispatch(setUser(res)))
      );
  }, [dispatch, userIsSet]);

  console.log("user:", user);


  return (
    <CssBaseline>
      <div>
        <NavBar />
        <Switch>
          <Route path="/form">
            <Form />
          </Route>
          <Route path="/havainnointiform">
            <ObservationSessionForm />
          </Route>
          <Route path="/havainnointilist">
            <ObservationSessionList />
          </Route>
          <Route path="/list">
            <HavaintoList />
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
