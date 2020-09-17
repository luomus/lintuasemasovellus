import React from "react";
import { Link } from "react-router-dom";
import "./NavBar.css";
import Header from "./Header";
import { loginUrl } from "../constants";
import { useDispatch, useSelector } from "react-redux";
import { getLogout } from "../services/user";
import { setUser } from "../reducers/userReducer";

const NavBar = () => {

  const user = useSelector(state => state.user);

  const dispatch = useDispatch();

  const logoutHandler = () => {
    getLogout()
      .then(() => {
        dispatch(setUser({}));
      });
  };

  const logoutLogin = user.id
    ?
    <a
      onClick={logoutHandler}
      href="#"
      id="logout-link"
    >
      logout
    </a>
    :
    <a
      id="login-link"
      href={`${loginUrl}`}
    >
      Kirjaudu
    </a>;

  const welcomeText = user.id
    ?
    <li>
      <a>
        Tervetuloa sovellukseen {user.fullName}!
      </a>
    </li>
    :
    null;

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
          {welcomeText}
          <li>
            {logoutLogin}
          </li>
        </ul>
      </nav>
      <hr></hr>
    </div>
  );
};

export default NavBar;
