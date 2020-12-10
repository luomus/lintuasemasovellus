import React from "react";
import { Box, Button } from "@material-ui/core";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";



const NavBarLinks = () => {
  const { t } = useTranslation();
  return (
    <Box>
      <Button id="frontpage" component={Link} to="/">
        {t("frontpage")}
      </Button>
      <br />
      <Button id="showdays" component={Link} to="/listdays">
        {t("showDaysPage")}
      </Button>
      <br />
      <Button id="manual" component={Link} to="/manual">
        {t("manualTitle")}
      </Button>
    </Box>
  );
};

export default NavBarLinks;

