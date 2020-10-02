import React from "react";
import { Box, Button } from "@material-ui/core";
import { Link } from "react-router-dom";




const NavBarLinks = () => {
  return (
    <Box>
      <Button component={Link} to="/">
        Etusivu
      </Button>
      <br />
      <Button component={Link} to="/havainnointiform">
        Lisää päivä
      </Button>
      <br />
      <Button component={Link} to="/havainnointilist">
        Näytä päivät
      </Button>
    </Box>
  );
};

export default NavBarLinks;

