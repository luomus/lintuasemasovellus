# Käyttöohjeet

Lintuasemasovellus Haukka toimii selaimessa, eikä sitä tarvitse erikseen asentaa. Sovellus tarvitsee toimiakseen internet-yhteyden. Lisätäkseen ja selatakseen sovelluksen tietoja käyttäjän tulee kirjautua sisään. Sovellukseen voi tunnistautua mm. Laji.fi - sekä Google-tunnuksilla. Sisäänkirjautuminen tapahtuu login-sivulta, jonne sisäänkirjautumaton käyttäjä ohjataan automaattisesti. Uloskirjautuminen tapahtuu sovelluksen oikeasta yläkulmasta.

## Lintuaseman valinta

Ensimmäistä kertaa sisäänkirjautuessa käyttäjää pyydetään valitsemaan listasta oikea lintuasema, jonka tietoja käyttäjä haluaa katsella. Sovelluksen listausnäkymät näyttävät tietoa ainoastaan käyttäjän valitsemalta lintuasemalta, ja käyttäjän lisäämät havainnot ja päivät tallennetaan kyseiselle lintuasemalle.
Sovellus muistaa käyttäjän lintuasemavalinnan, eikä sitä tarvitse valita enää uudelleen seuraavan sisäänkirjautumisen yhteydessä. Sisäänkirjautunut käyttäjä voi kuitenkin aina halutessaan vaihtaa lintuasemaa sivuston yläreunasta löytyvää 'Vaihda lintuasemaa' -nappia painamalla. Sovellus muistaa aseman muutoksen.

## Päivän ja havaintojen lisääminen

Sovelluksen etusivulta löytyy havaintolomake, jonka avulla tietokantaan lisätään päiviä, havaintojaksoja ja havaintoja sekä muita tietoja, joita ovat päiväkohtaiset havainto- ja pyydyskommentit, havaintoaktiivisuustiedot ja pyydykset. Etusivulle ensi kertaa tultaessa oletuksena näistä on näkyvissä päivämäärä-, havainnoijat- sekä havainnot-kenttä. Muita tietoja pääsee täyttämään klikkaamalla kyseisen kentän otsaketta. (Otsakerivin tunnistaa oikeassa reunassa olevasta pienestä ylös- tai alaspäin osoittavasta nuolesta.) Kentät saa taas pienennettyä painamalla samasta otsakkeesta. Kenttiin kirjoitetut tiedot pysyvät tallessa vaikka kenttä piilotettaisiinkin.

Lomake käyttää oletuksena nykyistä päivämäärää, mutta käyttäjä voi vaihtaa päivämäärän kalenterista tai kirjoittamalla sen päivämääräkenttään. Havainnot tallennetaan tälle päivälle. 

Jos päivälle löytyy jo tietoja tietokannasta, sovellus täyttää ne kaikki, havaintoja lukuunottamatta, automaattisesti oikeisiin kenttiin. Käyttäjä voi halutessaan päivittää nämä mieleisikseen.
Jos päivää ei ole lisätty tietokantaan aiemmin, uusi päivä luodaan. Käyttäjän tulee kirjoittaa päivälle havainnoija(t). Kommentti, havaintoaktiivisuus- ja pyydysmerkinnät ovat vapaaehtoisia.

### Havaintoaktiivisuustietojen lisääminen

Havaintoaktiivisuustietoja voi ilmoittaa raksimalla ko. kohdasta toteutuneet toiminnot sekä ilmoittamalla päivään liittyvien liitteiden määrän. Mikäli päivälle on merkitty jo liitteitä (kentän arvo on jo valmiiksi esim. 1), lisäätään tähän arvoon uusien liitteiden arvo. Eli jos liitteitä on jo 1 ja käyttäjä haluaa ilmoittaa oman uuden liitteensä, tulee arvoksi laittaa 2.

Mikäli aktivisuustietojen täytössä on jotain virheitä tai huomautettavaa, ilmestyy tästä viesti havaintoaktiivisuusotsakkeen alle. Punaisella olevat virheet estävät tallentamisen.

### Pyydystietojen lisääminen

Pyydystiedot voi lisätä 'Pyydystiedot'-otsakkeen alta. Pyydykset ilmoitetaan yksi pyydystyyppi per rivi. Uusi rivi lisätään painamalla '+'-nappia.

Mikäli halutaan muokata jo ilmoitettujen pyydysten lukumääriä tai verkkokoodeja, tulee lisäykset tehdä edellisten merkintöjen lisäksi, eli jos esimerkiksi halutaan lisätä pyydsten määrää yhdellä, on lukumääräksi laitettava aiempi arvo + 1, ei vain 1. 
Mikäli pyydystietojen täytössä on jotain virheitä tai huomautettavaa, ilmestyy tästä viesti'Pyydystiedot'-otsakkene alle. Punaisella olevat virheet estävät tallentamisen.

### Havaintojen lisääminen

Käyttäjän tulee valita lisättävien havaintojaksojen tyyppi sekä havaintopaikka, jossa havaintojaksot on kirjattu. Nämä valinnat tapahtuvat pudotusvalikoista pikakirjoituslomakkeessa 'Havainnot*'-otsakkeen alla.

Havaintojaksot ja niiden sisältämät havaintojaksot kirjataan pikakirjoituskenttään. Havainnot ja jaksot syötetään pikakirjoitusmuodossa:
(Yksi laji per rivi, kullekin jaksolle aloitus- ja lopetusaika, joiden väliin havainnot tulevat)

Mikäli ilmoitetaan peräkkäisiä jaksoja, eli edellisen jakson loppuaika on sama kuin seuraavan jakson alkuaika, riittää, että kellonaika ilmoitetaan vain kerran (sen saa halutessaan tosin merkata kahdesti peräkkäin)

&nbsp;&nbsp;&nbsp;_10:00_

&nbsp;&nbsp;&nbsp;_sommol 1/2 W_

&nbsp;&nbsp;&nbsp;_10:30_

&nbsp;&nbsp;&nbsp;_grugru 3ad/2juv/5subad s +-_

&nbsp;&nbsp;&nbsp;_11:00_

Mikäli jaksojen väliin tulee taukoja, muista määritellä aiemman jakson loppuaika erikseen

&nbsp;&nbsp;&nbsp;_10:00_

&nbsp;&nbsp;&nbsp;_sommol 1/2 W_

&nbsp;&nbsp;&nbsp;_11:00_

&nbsp;&nbsp;&nbsp;_12:00_

&nbsp;&nbsp;&nbsp;_grugru 3ad/2juv/5subad s +-_

&nbsp;&nbsp;&nbsp;_12:30_

Tauon voi myös merkitä erikseen.

&nbsp;&nbsp;&nbsp;_11:00_

&nbsp;&nbsp;&nbsp;_tauko_

&nbsp;&nbsp;&nbsp;_11:30_

&nbsp;&nbsp;&nbsp;_grugru 3ad/2juv/5subad s +-_

&nbsp;&nbsp;&nbsp;_12:00_

Pikakirjoituslomake ilmoittaa pikakirjoituksessa ilmenevistä virheistä. Virheet näkyvät pikakirjoituskentän vasemmassa reunassa varoituskolmioina virheellisten rivien kohdalla. Lisäksi sivun oikeaan laitaan ilmestyy keltainen laatikko, jossa kuvaillaan löydetyt virheet. 

### Tallennus

Tallenna-nappi aktivoituu painettavaksi, kun sivulla ei ole virheilmoituksia ja vaaditut kentät on täytetty. Napin painalluksen myötä päivä ja siihen liittyvät tiedot tallentuvat tietokantaan. Onnistuneesta tallennuksesta ilmoitetaan käyttäjälle.

### Tietojen kopiointi
Edellisen päivät tiedot voidaan myös automaattisesti kopioida nykyiselle päivälle. Lomakkeen oikeassa yläkulmassa olevasta kopio-ikonista painamalla avautuu valikko, josta käyttäjä voi valita, mitkä tiedot haluataan kopioida. Tiedot täyttyvät automaattisesti oikeisiin kenttiin, ylikirjottaen kaikki mahdolliset aiemmat merkinnät. Tämä mahdollisuus ei koske havaintoja.

## Päivien ja havaintojen selaaminen

Viimeisimmät viisi päivää näkyvät sivupalkissa sovelluksen etusivulla, ja niihin päästään siirtymään klikkaamalla. Muita päiviä pääsee selaamaan Näytä päivät -linkin kautta. Avautuvassa listassa näkyvät kaikki valitulle lintuasemalle tallennetut päivät aikajärjestyksessä, sekä päiviin liittyvät havainnoijat ja kommentit.

Päivää klikkaamalla päästään tarkastelemaan kyseiseen päivään liittyvää yhteenvetoa. Yhteenvetosivulla näkyy päivän havainnoijat sekä kommentti. Sivulta löytyy myös kaksi yhteenvetotaulukkoa (lajit ja jaksot), joiden välillä liikutaan nappia painamalla. Lajit-taulukossa näkyvät kaikki kyseisenä päivänä havaitut lajit kultakin havaintojaksotyypiltä. Jaksot-taulukossa taas näkyvät kunkin jakson tiedot kyseiseltä päivältä. Jaksoa klikkaamalla aukeaa ikkuna, jossa on yhteenveto jakson aikana tehdyistä havainnoista. Ikkuna sulkeutuu klikkaamalla sen ulkopuolelle.

## Päivän ja havaintojen tietojen muokkaaminen

Päivän tietojen muokkaaminen tapahtuu päivän yhteenvetosivulta. Muita tietoja kuin havaintoja voidaan muokata kunkin kentän vierestä löytyviä kynäikoneja painamalla. Muokkausta varten aukeaa oma muokkausnäkymänsä, joiden avulla tietoja voidaan päivittää. Jos päivälle halutaan lisätä vain yksittäisiä pyydystietoja ilman havaintoja, voidaan se tehdä tästä näkymästä painamalla pyydystietojen kohdalta '+'-nappia.

Jaksojen ja havaintojen muokkaaminen tapahtuu kahdella tavalla:
Ensijiainen tapa on valita jaksot-näkymässä kunkin jakson kohdalla olevaa kynäikonia, jolloin päästään muokkaamaan kyseisen havaintojakson pikakirjoitusta.
Vaihtoehtoisesti havaintotaulukon yläreunasta löytyy 'Muokkaa havaintoja' -nappi. Tätä painamalla aukeaa pikakirjoituskenttä, jonka yläreunasta valitaan jakso ja sijainti, joiden tietoja halutaan muokata. Tällöin pikakirjoituskenttään latautuu kaikki kyseiseen jaksotyyppiin ja sijaintiin liittyvä pikakirjoitus, jota voidaan muokata.

Kaikki tiedot voidaan myös poistaa kokonaan kunkin kentän muokkausnäkymässä olevaa 'Poista'-nappia painamalla.
