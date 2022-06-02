# Ohjelman käynnistäminen paikallisesti

Käynnistä VPN-yhteys Helsingin yliopiston nettiin, jos aiot käyttää paikallisesti Oracle-tietokantaa.  


## Koko ohjelman käynnistys yhdellä komennolla

Mene projektin juurihakemistoon.

Käynnistääksesi sovelluksen siten, että samalla asentuu tarvittavat ohjelman osat kirjoita komento

`. install-start.sh`

Jos koneellasi on jo asennettuna kaikki tarpeellinen, käynnistyy sovellus komennolla
`. start.sh`

Tämän jälkeen voit tarkastella sovellusta kirjoittamalla selaimeen

http://localhost:3000

Silloin kun suljet sovelluksen, olet backend-kansiossa ja pythonin virtuaaliympäristö on päällä. Tällöin voit avata sovelluksen uudestaan komennolla

`flask run --port=3000`

Jos teet frontendiin muutoksia, niin muutokset eivät heijastu backendin käynnistyksessä. Frontissa täytyy luoda uusi build-kansio ja kopioida se backendiin. Frontend-kansiossa komento `npm run build-copy` tekee tämän työn. Huom: npm build ei ehkä toimi jos on tyylivirheitä.



## Ohjelman käynnistäminen frontend-kehittäjille

Jotta frontendissä tehdyt muutokset näkyisivät suoraan, tulee frontend ja backend käynnistää eri porteissa. 

Backendin voi käynnistää frontend-kansiosta käsin komennolla
`npm run start-api`. Tämä käynnistää sen porttiin 5000. Frontendin voi sitten käynnistää frontend-kansiossa porttiin 3000 komennolla `npm start`.

Backendin ja frontendin täytyy olla samanaikaisesti päällä, eli ne tulee käynnistää komentorivillä eri välilehdille. Nyt kun frontendiin tekee muutoksia, ne heijastuvat heti portissa 3000.

Kirjautuminen voi olla ongelmallista tällä käynnistämisellä. Kun olet kirjautunut sisään laji.fi tunnuksilla, niin sinut uudelleenohjataan takaisin sisäänkirjautumissivulle. Osoiterivi on nyt muotoa ´ localhost:3000/login?token=123 ´, korjaa portti 3000 osoiterivillä porttiin 5000 ja kirjautumisen pitäisi onnistua. Tämän jälkeen muokkaa osoiterivillä portti 5000 takaisin porttiin 3000. Nyt kirjautumistiedot pysyvät välimuistissa.

Edellä kuvatulla epämääräisellä porttikikkailulla saadaan aikaan se, että authtoken lähetetään backendiin.


# Mahdollisten ongelmien ratkaisuja

Komento `npm install` pitää ehkä joskus ajaa ensin, esim projektin kloonaamisen jälkeen. 

Jos tietokanta ei näytä toimivan, muista vpn-yhteys. Lisäksi backendin juurikansiossa pitää olla tiedosto .env joka sisältää oraclen tunnistetietoja yms. Jos sovelluksen haluaa käynnistää paikallisesti sqlite-tietokannalla, niin tämän voi säätää backendin juurikansiossa lintuasemasovellus.py-tiedostossa. .env-tiedoston pitää silti sisältää kirjautumiseen tarvittavia tietoja.
