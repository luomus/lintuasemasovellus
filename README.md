# Lintuasemasovellus

Helsingin Yliopiston Ohjelmistotuotantoprojekti, syksy 2020

## Kehitysympäristön asennus

### API/Backend

Asenna Python3.

API projektia varten konffaa Pythonin virtuaaliympäristö(venv). Alla ohjeet Ubuntu/Debian pohjaisille Linux jakeluille asennuskriptin käyttöön.

* Kloonaa projekti
* Siirry `lintuasema-backend/` hakemistoon
* Suorita `. install.sh`
* Skripti aktivoi virtuaaliympäristön, kun lopetat työskentelyn poistu virtuaaliympäristöstä `deactivate` komennolla

Kun aloitat työskentelyn aktivoi virtuaaliympäristö suorittamalla `. venv/bin/activate` ja lopettaessa poistu virtuaaliympäristöstä `deactivate` komennolla.

Jos asennat/päivität paketteja, päivitä riippuvuudet aktiivisessa virtuaaliympäristössä komennolla `pip freeze > requirements.txt`

Jos riipuuvudet tarvitsee päivittää, esimerkiksi `git pull` jälkeen, suorita `pip install -r requirements.txt` aktiivisessa virtuaaliympäristössä (tai `. install.sh`).

Kehityspalvelin käynnistetään suorittamalla `flask run` lintuasema-backend/ hakemistossa. Käytössä on python-dotenv moduuli jolloin flask lataa ympäristömuuttujat `.flaskenv` tiedostosta.

### Frontend

Projekti käyttää frontendkehityksessä npm-paketinhallintajärjestelmää ja se on bootstrapattu create-react-app-skriptillä.

Siirry `frontend/` hakemistoon. Ajaaksesi frontendiä kehitystilassa, varmista ensin että olet asentanut tarvittavat riippuvuudet. Nämä saat asennettua ajamalla frontend-hakemistossa `npm install` tarvittaessa, esimerkiksi kun olet juuri kloonannut projektin. Ajamalla komennon `npm start` frontend-hakemistossa saat frontendin käynnistymään selaimeen. 

Jos haluat myös backendin käyttöön, aja lisäksi esim. toisella komentorivillä `npm run start-api` frontend-hakemistossa. Huomaa, että pythonin virtuaaliympäristön tulee olla tätä varten valmiina (katso siis edellinen kohta, API/Backend). 

Komento `npm install <paketti> --save` asentaa uuden paketin ja asettaa sen projektin ajonaikaiseksi riippuvuudeksi. Vastaavasti komento `npm install <paketti> --save-dev` asentaa uuden paketin ja asettaa sen kehitysaikaiseksi riippuvuudeksi. Riippuvuudet tallentuvat tällä tavoin package.json -tiedostoon frontend-hakemistossa. 

Komennon `npm update` ajaminen juurihakemistossa päivittää projektin riippuvuudet kunnioittaen samalla asetettuja semanttisia versionumeroita package.json -tiedostossa. 

#### Buildaaminen

Saadaksesi käyttöön produktiokelpoisen fronttikoodin, aja `npm build` frontendin juuressa. Komento tuottaa build-nimisen hakemiston frontendin juureen. Jos haluat koodin backendin käyttöön, kopioi hakemisto sisältöineen backendin juurihakemistoon (esim. `cp -r build/ ../lintuasemasovellus-backend`). Tämä tulee tehdä ennen deployausta. 

## Definition of Done

Alla määritelmä sille, mitä vaatimuksia User Story:n tulee täyttää, että sen katsotaan olevan valmis. Vaatimuksia voidaan tarvittaessa tarkentaa projektin edetessä. 

* analysoitu
* suunniteltu
* ohjelmoitu
* testattu
* testaus automatisoitu
* dokumentoitu
* integroitu muuhun ohjelmistoon
* viety tuotantoympäristöön
