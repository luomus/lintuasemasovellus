import React from "react";
//import { useTranslation } from "react-i18next";
import textlogo from "../resources/haukka-text-logo-white.svg";

const Header = () => {

  //const { t } = useTranslation();

  return (
    <a href="/">
      <img
        src={textlogo}
        height="35"
        alt="haukka"
      >
      </img>
    </a>
  );
};

export default Header;
