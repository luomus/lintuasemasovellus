import React from "react";
import { Link } from "react-router-dom";
import textlogo from "../resources/haukka-text-logo-white.svg";

const Header = () => {

  return (
    <Link to="/">
      <img
        src={textlogo}
        height="35"
        alt="haukka"
      >
      </img>
    </Link>
  );
};

export default Header;
