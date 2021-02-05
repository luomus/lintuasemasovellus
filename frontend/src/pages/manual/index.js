import React from "react";
import { Paper, Typography } from "@material-ui/core/";
import { makeStyles } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";
import { Redirect } from "react-router-dom";
import { useSelector } from "react-redux";


const useStyles = makeStyles({
  paper: {
    background: "white",
    width: "70%",
    padding: "20px 30px",
    margin: "10px 10px 10px 10px"
  },
  card: {
    background: "white",
    margin: "10px 10px 10px 10px"
  },
});


export const UserManual = () => {
  const classes = useStyles();

  const { t } = useTranslation();

  const user = useSelector(state => state.user);
  const userIsSet = Boolean(user.id);

  if (!userIsSet) {
    return (
      <Redirect to="/login" />
    );
  }

  return (
    <div>

      <Paper className={classes.paper}>
        <Typography variant="h5" component="h2" >
          {t("manualTitle")}
        </Typography>
        <br />
        Lintuasemasovellus Haukka toimii selaimessa eikä sitä tarvitse erikseen asentaa. Sovellus tarvitsee toimiakseen internet-yhteyden. Lisätäkseen ja selatakseen sovelluksen tietoja käyttäjän tulee kirjautua sisään. Sovellukseen voi tunnistautua mm. Laji.fi - sekä Google-tunnuksilla.
        Sisäänkirjautuminen tapahtuu login-sivulta jonne sisäänkirjautumaton käyttäjä ohjataan automaattisesti. Uloskirjautuminen tapahtuu sovelluksen oikeasta yläkulmasta.
        <br />
        <br />

        <Typography variant="h6" component="h2" >
          Lintuaseman valinta
        </Typography>
        <br />
        Sisäänkirjautumisen jälkeen aukeaa valikko josta käyttäjä valitsee lintuaseman jonka tietoja käyttäjä haluaa katsella.
        Sovelluksen listausnäkymät näyttävät tietoa ainoastaan käyttäjän valitsemalta lintuasemalta, ja käyttäjän lisäämät havainnot ja päivät tallennetaan kyseiselle lintuasemalle. Sisäänkirjautumisen jälkeen käyttäjä voi vaihtaa lintuasemaa etusivun pikakirjoituslomakkeen yläreunasta nappia painamalla.
        <br />
        <br />

        <Typography variant="h6" component="h2" >
          Päivän ja havaintojen lisääminen
        </Typography>
        <br />
        Sovelluksen etusivulta löytyy pikakirjoituslomake, jonka avulla tietokantaan lisätään päiviä, havaintojaksoja ja havaintoja.
        Käyttäjä valitsee kalenterista tai kirjoittaa päivämäärän jolle havaintojaksot lisätään.
        <br /> <br />Jos päivä löytyy jo tietokannasta, sovellus näyttää kyseiselle päivälle tallennetut havainnoijat ja kommentit. Käyttäjä voi halutessaan päivittää nämä mieleisikseen.
        <br />Jos päivää ei ole lisätty tietokantaan aiemmin, uusi päivä luodaan. Käyttäjän tulee kirjoittaa päivälle havainnoija(t). Kommenttikenttä on vapaaehtoinen.
        <br /> <br />Käyttäjän tulee valita lisättävien havaintojaksojen tyyppi sekä havaintopaikka jossa havaintojaksot on kirjattu. Nämä valinnat tapahtuvat pudotusvalikoista pikakirjoituslomakkeessa.
        <br /> <br />Havaintojaksot ja niiden sisältämät havaintojaksot kirjataan pikakirjoituskenttään. Havainnot ja jaksot syötetään pikakirjoitusmuodossa:
        <br />(parillinen määrä kellonaikoja, yksi laji per rivi, kullekin jaksolle aloitus- ja lopetusaika)
        <br />
        <br />10:00
        <br />sommol 1/2 W
        <br />11:00
        <br />11:00
        <br />grugru 3ad/2juv/5subad s +-
        <br />12:00
        <br />
        <br />
        Jos pikakirjoituslomakkeessa on virheitä, sovellus ilmoittaa tästä keltaisella varoitusikkunalla ja pyytää tarkistamaan pikakirjoituksen oikeellisuuden. Varoitusikkunassa kerrotaan, millaisen virheen sovellus pikakirjoituksessa havaitsi. Tallenna-nappi aktivoituu painettavaksi kun pikakirjoituksessa ei ole virheitä ja vaaditut kentät on täytetty. Napin painalluksen myötä päivä ja siihen liittyvät tiedot tallentuvat tietokantaan.
        <br /><br />

        <Typography variant="h6" component="h2" >
          Päivien ja havaintojen selaaminen
        </Typography>
        <br />
        Viimeisimmät viisi päivää näkyvät sivupalkissa sovelluksen etusivulla, ja niihin päästään siirtymään klikkaamalla. Muita päiviä pääsee selaamaan Näytä päivät -linkin kautta. Avautuvassa listassa näkyvät kaikki valitulle lintuasemalle tallennetut päivät aikajärjestyksessä, sekä päiviin liittyvät havainnoijat ja kommentit.
        <br /> <br />Päivää klikkaamalla päästään tarkastelemaan kyseiseen päivään liittyvää yhteenvetoa. Yhteenvetosivulla näkyy päivän havainnoijat sekä kommentti. Sivulta löytyy myös kaksi yhteenvetotaulukkoa (lajit ja jaksot) joiden välillä liikutaan nappia painamalla.
        Lajit-taulukossa näkyvät kaikki kyseisenä päivänä havaitut lajit kultakin havaintojaksotyypiltä. Jaksot-taulukossa taas näkyvät kunkin jakson tiedot kyseiseltä päivältä. Jaksoa klikkaamalla aukeaa ikkuna jossa on yhteenveto jakson aikana tehdyistä havainnoista. Ikkuna sulkeutuu klikkaamalla sen ulkopuolelle.
        <br />
        <br />

        <Typography variant="h6" component="h2" >
          Päivän ja havaintojen tietojen muokkaaminen
        </Typography>
        <br />
        Havainnoijien ja kommentin muokkaaminen tapahtuu yhteenvetosivulta. Havainnoija(t) ja Kommentti -kenttien vieressä olevia kynäikoneja painamalla aukeavat muokkauskentät joiden avulla tietoja voidaan päivittää.
        <br /> Jaksojen ja havaintojen muokkaaminen tapahtuu yläreunan Muokkaa-napin kautta. Aukeaa pikakirjoituskenttä, jonka yläreunasta valitaan jakso ja sijainti joiden tietoja halutaan muokata. Tällöin pikakirjoituskenttään latautuu kyseiseen jaksotyyppiin ja sijaintiin liittyvä pikakirjoitus jota voidaan muokata. Poista-napin kautta pikakirjoitus voidaan myös kokonaan poistaa.
        <br />
        <br />

      </Paper>
      <br />
      <br />
      <br />
    </div>
  );
};

