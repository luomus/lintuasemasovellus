import React, { useState } from "react";
import { Link } from "react-router-dom";


const NavBarLinks = () => {
    return (
        <links>
            <Link to="/">
                Etusivu
  </Link>
            <br />
            <Link to="/havainnointiform">
                Lisää havainnointikerta
</Link>

            <br />
            <Link to="/havainnointilist">
                Näytä havainnointikerrat
</Link>

            <br />
            <Link to="/form">
                Lisää havaintoja
</Link>

            <br />
            <Link to="/list">
                Näytä havainnot
</Link>
        </links>
    );
};

export default NavBarLinks;

