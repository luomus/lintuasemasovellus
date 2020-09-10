import React from "react";
import { Link } from "react-router-dom";
import "./NavBar.css";
import Header from "./Header";

const NavBar = () => {
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
            <Link to = "/">
            Lisää havaintoja
            </Link>
          </li>
          <li>
            <Link to ="/">
            About
            </Link>
          </li>
          <li>
            <a id="login-link" href="http://www.google.com">Kirjaudu</a>
          </li>
        </ul>
      </nav>
      <hr></hr>
    </div>
  );
};

export default NavBar;
