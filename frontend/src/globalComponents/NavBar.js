import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./NavBar.css";
import Header from "./Header";
import { getAuth } from "../services";


const NavBar = () => {


  const [authJson, setAuthJson] = useState({});

  const kirjauduButton = () => {
    getAuth()
      .then(res => res.data)
      .then(authjson => setAuthJson(authjson));
  };

  console.log(authJson);

  return (
    <div>
      <nav className="navbar">
        <ul>
          <li>
            <Link to = "/">
              <Header />
            </Link>
          </li>
          <li>
            <Link to = "/form">
            Lisää havaintoja
            </Link>
          </li>
          <li>
            <Link to = "/list">
              Listaa havainnot
            </Link>
          </li>
          <li>
            <Link to ="/">
            About
            </Link>
          </li>
          <li>
            <a
              onClick={ kirjauduButton }
              style={ { cursor: "pointer" } }
              id="login-link"
              href="javascript:void(0)"
            >
              Kirjaudu
            </a>
          </li>
        </ul>
      </nav>
      <hr></hr>
    </div>
  );
};

export default NavBar;
