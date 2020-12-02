import React from "react";
import { useTranslation } from "react-i18next";

const Header = () => {

  const { t } = useTranslation();

  return (
    <header>
      {t("title")}
    </header>
  );
};

export default Header;
