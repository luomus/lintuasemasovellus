import React, { useEffect, useState } from "react";
import Header from "./globalComponents/Header";
import NavBar from "./globalComponents/NavBar";
import { Switch, Route } from "react-router-dom";
import { HomePage } from "./pages";
import Footer from "./globalComponents/Footer";
import { getHello } from "./services";


const App = () => {

  const [text, setText] = useState("");

  useEffect(() => {
    getHello()
      .then(res => res.data)
      .then(response => setText(response));
  }, []);

  return (
    <div>
      <Header />
      <NavBar />
      <Switch>
        <Route path="/">
          {text}
          <HomePage />
        </Route>
      </Switch>
      <Footer />
    </div>
  );

};

export default App;
