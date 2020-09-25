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
        Lisää havainnointikerta
      </Button>
      <br />
      <Button component={Link} to="/havainnointilist">
        Näytä havainnointikerrat
      </Button>
      <br />
      <Button component={Link} to="/form">
        Lisää havaintoja
      </Button>
      <br />
      <Button component={Link} to="/list">
        Näytä havainnot
      </Button>
    </Box>
  );
};

export default NavBarLinks;

