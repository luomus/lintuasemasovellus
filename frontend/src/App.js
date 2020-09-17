import React, { useEffect, useState } from "react";
import NavBar from "./globalComponents/NavBar";
import { Switch, Route } from "react-router-dom";
import { HomePage } from "./pages";
import Footer from "./globalComponents/Footer";
import { Form, ObservationSessionForm, ObservationSessionList, HavaintoList } from "./pages";
import { getAuth, getToken } from "./services/user";

const App = () => {

  const [user, setUser] = useState({});


  useEffect(() => {
    getToken()
      .then(resp => resp.data)
      .then(tokenJson => getAuth(tokenJson.token, tokenJson.auth_token)
        .then(resp => resp.data)
        .then(res => setUser(res))
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
