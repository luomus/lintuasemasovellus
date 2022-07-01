# API/Backend

Asenna Python3.

API projektia varten konffaa Pythonin virtuaaliympäristö(venv). Alla ohjeet Ubuntu/Debian pohjaisille Linux jakeluille asennuskriptin käyttöön.

* Kloonaa projekti
* Siirry `lintuasema-backend/` hakemistoon
* Suorita `. install.sh`
* Skripti aktivoi virtuaaliympäristön, kun lopetat työskentelyn poistu virtuaaliympäristöstä `deactivate` komennolla

Kun aloitat työskentelyn aktivoi virtuaaliympäristö suorittamalla `. venv/bin/activate` ja lopettaessa poistu virtuaaliympäristöstä `deactivate` komennolla.

Jos asennat/päivität paketteja, päivitä riippuvuudet aktiivisessa virtuaaliympäristössä komennolla `pip freeze > requirements.txt`. Huom, tämä komento yleensä lisää rivin `pkg-resources==0.0.0`. Tämä pitää poistaa requirements.txt-tiedostosta, tai muuten Docker, Heroku yms. lakkaavat toimimasta.

Jos riipuuvuudet tarvitsee päivittää, esimerkiksi `git pull` jälkeen, suorita `pip install -r requirements.txt` aktiivisessa virtuaaliympäristössä (tai `. install.sh`).

Kehityspalvelin käynnistetään suorittamalla `flask run` lintuasema-backend/ hakemistossa. Käytössä on python-dotenv moduuli jolloin flask lataa ympäristömuuttujat `.flaskenv` tiedostosta.


## Windows

Asennus Windowsille voi olla hieman hankalampaa, mutta suurin osa yllä olevista ohjeista ovat silti toimivia. Käytin itse condan tarjoamaa virtuaaliympäristöä, jossa python versioni oli 3.7, koska kohtasin vaikeuksia uudemmilla versioilla. Condan voi ladata täältä
https://docs.conda.io/projects/conda/en/latest/user-guide/install/windows.html
Condan asennuksen ja repon kloonaamisen jälkeen uuden virtuaaliympäristön voi luoda halutulla python versiolla projektikansioon komennolla conda create -n <nimi> python=3.7, esim itse käytin nimeä py37 eli komento olisi 

conda create -n py37 python=3.7

Jonka jälkeen virtuaaliympäristön voi avata komennolla conda activate <nimi>

Jos käytät condan ympäristöä, mene ympäristöön ja suorita pip install -r requirements.txt, jolloin saat kaikki tarvittavat pip-paketit. Älä käytä install.sh-skriptiä, jos käytät condan ympäristöä.
Muista, että paketit on nyt asennettu conda-ympäristöösi, eli jos sovellus herjaa pakettien puuttumisesta, paketit on todennäköisesti asennettu väärään ympäristöön tai et ole suorituksen aikana oikeassa ympäristössä.

Jos tietokanta ei tunnu toimivan, muuta lintuasemasovellus.py:ssä oleva rivi db_type = os.environ.get("DB_TYPE", "oracle") => db_type = os.environ.get("oracle"),
jos Oracle on asennettu. Muussa tapauksessa muuta get-kutsu mihin tahansa muuhun, jolloin se kutsuu itsestään sqliteä. Jos tietokannan pitäisi toimia, mutta kirjautuessa
sovellus ohjaa takaisin kirjautumissivulle, mene osoiteriviin ja muuta sieltä localhostin jälkeinen portti 3000 -> 5000. Tämä virhe tapahtuu onneksi vain lokaalisti.

HUOM: sovellukseen pääsee vain valtuutetut henkilöt, joten uusien devaajien täytyy hankkia valtuudet esimerkiksi sovelluksen kirjautuessa antamien ohjeiden avulla. 
Helpointa on varmaankin kysyä Eskolta apua.