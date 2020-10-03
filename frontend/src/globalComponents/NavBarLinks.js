import React from "react";
import { Box, Button } from "@material-ui/core";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";



const NavBarLinks = () => {
  const { t } = useTranslation();
  return (
    <Box>
      <Button component={Link} to="/">
        {t("frontpage")}
      </Button>
      <br />
      <Button component={Link} to="/havainnointiform">
        {t("addDayPage")}
      </Button>
      <br />
      <Button component={Link} to="/havainnointilist">
        {t("showDaysPage")}
      </Button>
    </Box>
  );
};

export default NavBarLinks;

