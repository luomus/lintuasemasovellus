import React, { useState } from "react";
import Button from '@material-ui/core/Button';



const NavBarLinks = () => {
    return (
        <links>
            <Button href="/">
                Etusivu
  </Button>
            <br />
            <Button href="/havainnointiform">
                Lisää havainnointikerta
</Button>

            <br />
            <Button href="/havainnointilist">
                Näytä havainnointikerrat
</Button>

            <br />
            <Button href="/form">
                Lisää havaintoja
</Button>

            <br />
            <Button href="/list">
                Näytä havainnot
</Button>
        </links>
    );
};

export default NavBarLinks;

