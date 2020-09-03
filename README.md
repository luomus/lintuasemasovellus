# Lintuasemasovellus

Helsingin Yliopiston Ohjelmistotuotantoprojekti, syksy 2020

## Kehitysympäristön asennus

### API/Backend

Asenna Python3.

API projektia varten konffaa Pythonin virtuaaliympäristö(venv). Alla ohjeet Ubuntu/Debian pohjaisille Linux jakeluille asennuskriptin käyttöön.

* Kloonaa projekti
* Siirry `api/` hakemistoon
* Suorita `. install.sh`
* Skripti aktivoi virtuaaliympäristön, kun lopetat työskentelyn poistu virtuaaliympäristöstä `deactivate` komennolla

Kun aloitat työskentelyn aktivoi virtuaaliympäristö suorittamalla `. venv/bin/activate` ja lopettaessa poistu virtuaaliympäristöstä `deactivate` komennolla.

Jos asennat/päivität paketteja, päivitä riippuvuudet aktiivisessa virtuaaliympäristössä komennolla `pip freeze > requirements.txt`

Jos riipuuvudet tarvitsee päivittää, esimerkiksi `git pull` jälkeen, suorita `pip install -r requirements.txt` aktiivisessa virtuaaliympäristössä (tai `. install.sh`).

### Frontend

TODO

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
