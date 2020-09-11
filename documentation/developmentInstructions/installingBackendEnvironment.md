# API/Backend

Asenna Python3.

API projektia varten konffaa Pythonin virtuaaliympäristö(venv). Alla ohjeet Ubuntu/Debian pohjaisille Linux jakeluille asennuskriptin käyttöön.

* Kloonaa projekti
* Siirry `lintuasema-backend/` hakemistoon
* Suorita `. install.sh`
* Skripti aktivoi virtuaaliympäristön, kun lopetat työskentelyn poistu virtuaaliympäristöstä `deactivate` komennolla

Kun aloitat työskentelyn aktivoi virtuaaliympäristö suorittamalla `. venv/bin/activate` ja lopettaessa poistu virtuaaliympäristöstä `deactivate` komennolla.

Jos asennat/päivität paketteja, päivitä riippuvuudet aktiivisessa virtuaaliympäristössä komennolla `pip freeze > requirements.txt`. Huom, tämä komento yleensä lisää rivin `pkg-resources==0.0.0`. Tämä pitää poistaa requirements.txt-tiedostosta, tai muuten Docker, Heroku yms. lakkaavat toimimasta.

Jos riipuuvudet tarvitsee päivittää, esimerkiksi `git pull` jälkeen, suorita `pip install -r requirements.txt` aktiivisessa virtuaaliympäristössä (tai `. install.sh`).

Kehityspalvelin käynnistetään suorittamalla `flask run` lintuasema-backend/ hakemistossa. Käytössä on python-dotenv moduuli jolloin flask lataa ympäristömuuttujat `.flaskenv` tiedostosta.
