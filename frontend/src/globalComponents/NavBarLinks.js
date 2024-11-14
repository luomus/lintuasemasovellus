import React from "react";
import { Box, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles(() => ({
  navBarButton: {
    color: "black"
  },
}));

const NavBarLinks = () => {
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <Box>
      <Button id="frontpage" component={Link} to="/" className={classes.navBarButton}>
        {t("frontpage")}
      </Button>
      <br />
      <Button id="showdays" component={Link} to="/listdays" className={classes.navBarButton}>
        {t("showDaysPage")}
      </Button>
      <br />
      <Button id="manual" component={Link} to="/manual" className={classes.navBarButton}>
        {t("manualTitle")}
      </Button>
    </Box>
  );
};

export default NavBarLinks;

