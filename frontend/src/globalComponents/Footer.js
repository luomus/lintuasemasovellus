import React from "react";
import { makeStyles } from "@mui/styles";
import { Box } from "@mui/material";
import { useTranslation } from "react-i18next";


const useStyles = makeStyles({
  footer: {
    position: "fixed",
    bottom: 0,
    width: "100%",
    height: 50,
    background: "white",
    textAlign: "center"
  },
});

const Footer = () => {

  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <Box className={classes.footer} boxShadow={3}>
      <p>
        {t("footer")}
      </p>
    </Box>
  );
};

export default Footer;
