import React from "react";
import NavBar from "./globalComponents/NavBar";
import { Switch, Route } from "react-router-dom";
import { HomePage } from "./pages";
import Footer from "./globalComponents/Footer";
import { Form } from "./pages";

const App = () => {


  return (
    <div>
      <NavBar />
      <Switch>
        <Route path="/form">
          <Form />
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
