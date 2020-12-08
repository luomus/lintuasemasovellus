import React from "react";
//import { useTranslation } from "react-i18next";
import haukkalogo from "../resources/haukkalogo_white.png";

const Header = () => {

  //const { t } = useTranslation();

  return (
    <a href="/">
      <img
        src={haukkalogo}
        alt="haukka"
      >
      </img>
    </a>
  );
};

export default Header;
