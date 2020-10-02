# Ohjelman käynnistäminen paikallisesti

Käynnistä vpn yhteys Helsingin yliopiston nettiin.

Mene projektin juurihakemistoon.

Käynnistääksesi sovelluksen siten, että samalla asentuu tarvittavat ohjelman osat kirjoita komento

`. install-start.sh`

Jos koneellasi on jo asennettuna kaikki tarpeellinen, käynnistyy sovellus komennolla


`. start.sh`


Tämän jälkeen voit tarkastella sovellusta kirjoittamalla selaimeen

http://localhost:3000

Silloin kun suljet sovelluksen, olet backend-kansiossa ja pythonin virtuaaliympäristö on päällä. Tällöin voit avat sovelluksen uudestaan komennolla

`flask run --port=3000`

Jos teet frontendiin muutoksia, niin muutokset eivät heijastu backendin käynnistyksessä. Frontissa täytyy luoda uusi build-kansio ja kopioida se backendiin. Frontend-kansiossa komento `npm run build-copy`tekee tämän työn.
