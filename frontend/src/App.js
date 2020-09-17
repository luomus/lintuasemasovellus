import React, { useEffect } from "react";
import NavBar from "./globalComponents/NavBar";
import { Switch, Route } from "react-router-dom";
import { HomePage } from "./pages";
import Footer from "./globalComponents/Footer";
import { Form, ObservationSessionForm, ObservationSessionList, HavaintoList } from "./pages";
import { getAuth, getToken } from "./services/user";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "./reducers/userReducer";

const App = () => {

  const dispatch = useDispatch();

  const user = useSelector(state => state.user);

  useEffect(() => {
    getToken()
      .then(resp => resp.data)
      .then(tokenJson => getAuth(tokenJson.token, tokenJson.auth_token)
        .then(resp => resp.data)
        .then(res => dispatch(setUser(res)))
      );
  }, []);

  console.log("user:", user);


  return (
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
  );

};

export default App;
