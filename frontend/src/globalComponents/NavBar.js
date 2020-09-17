import React from "react";
import { Link } from "react-router-dom";
import "./NavBar.css";
import Header from "./Header";
import { loginUrl } from "../constants";


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
            <Link to = "/havainnointiform">
              Lisää havainnointikerta
            </Link>
          </li>
          <li>
            <Link to = "/havainnointilist">
              Listaa havainnointikerrat
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
              id="login-link"
              href={`${loginUrl}`}
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
