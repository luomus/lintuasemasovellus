import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import { Box } from "@material-ui/core";




const useStyles = makeStyles({
  footer: {
    position: 'fixed',
    bottom: 0,
    width: '100%',
    height: 50,
    background: "white",
    textAlign: "center"
  },
});

const Footer = () => {
  const classes = useStyles();

  return (
    <Box className={classes.footer} boxShadow={3}>
      <p>
        Lintuasemasovellus | Ohjelmistotuotantoprojekti 2020
      </p>
    </Box>
  );
};

export default Footer;