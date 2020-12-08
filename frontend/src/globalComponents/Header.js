import React from "react";
import { Link } from "react-router-dom";
//import { useTranslation } from "react-i18next";
import haukkalogo from "../resources/haukkalogo_white.png";

const Header = () => {

  //const { t } = useTranslation();

  return (
    <Link to="/">
      <img
        src={haukkalogo}
        height="35"
        alt="haukka"
      >
      </img>
    </Link>
  );
};

export default Header;
