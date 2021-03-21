const resources = {
  fi: {
    translation: {
      "intro": "Tervetuloa lintuasemasovellus Haukkaan. Suomessa sijaitsee 16 lintuasemaa. Lintuasemasovelluksen avulla käyttäjä voi kirjata lintuasemilla tehtyjä lintujen havaintotietoja vakioidussa muodossa. Havaintojen tallentaminen järjestelmään vaatii sisäänkirjautumisen.",
      "title": "Lintuasemasovellus",
      "footer": "Lintuasemasovellus Haukka | Luonnontieteellinen keskusmuseo LUOMUS",
      "login": "Kirjaudu sisään",
      "logout": "Kirjaudu ulos",
      "welcome": "Tervetuloa",
      "frontpage": "Etusivu",
      "addDayPage": "Lisää päivä",
      "showDaysPage": "Näytä päivät",
      "newDay": "Uusi päivä",
      "observatory": "Lintuasema",
      "date": "Päivämäärä",
      "observers": "Havainnoija(t)",
      "observations": "Havainnot",
      "comment": "Kommentti",
      "save": "Tallenna",
      "loading": "Ladataan...",
      "cancel": "Peruuta",
      "remove": "Poista",
      "confirm": "Vahvista",
      "Confirm deletion": "Vahvista poisto",
      "oneSpecies": "laji",
      "multipleSpecies": "lajia",
      "removingCannotBeCancelled": "Poistamista ei voi peruuttaa. Jatketaanko?",
      "observationPeriodNotDefined": "obsPeriod is undefined!",
      "catchType": "Pyydys",
      "netCodes": "Verkkokoodit",
      "catchArea": "Pyyntialue",
      "netLength": "Verkon pituus",
      "catchCount": "Lukumäärä",
      "add catch row": "Lisää pyydysrivi",

      "chooseTypeAndLocation": "(Valitse tyyppi ja sijainti)",
      "summary": "Lajit",
      "obsPeriods": "Jaksot",
      "edit": "Muokkaa",
      "editShorthand": "Muokkaa pikakirjoitusta",
      "days": "Päivät",
      "observationStation": "Havainnointiasema",
      "formSent": "Lomake lähetetty!",
      "formNotSent": "Lomakkeen lähetyksessä ongelmia. Tarkista internetyhteys   :(",
      "titleExample": "Esimerkkiotsikko",
      "readMore": "Lue lisää",
      "location": "Sijainti *",
      "observationperiod": "Havaintoperiodi",
      "observation": "Havainto",
      "type": "Tyyppi *",
      "startTime": "Alkuaika",
      "endTime": "Loppuaika",
      "periodSaved": "Lomake tallennettu tietokantaan",
      "periodNotSaved": "Lomakkeen tallennuksessa ongelmia :(",

      "manualTitle": "Käyttöohjeet",
      "manualTextShort": "Tähän kirjoitetaan lyhyt versio sovelluksen käyttöohjeista.",
      "manualText": "Tähän kirjoitetaan sovelluksen käyttöohjeet kokonaisuudessaan.",
      "writeObservationInShorthand": "Syötä havainto pikakirjoitusmuodossa",
      "evenAmountOfTimesOneSpeciesPerLine": "(parillinen määrä kellonaikoja, yksi laji per rivi)",
      "timeTen": "10:00",
      "shorthandExample1": "sommol 1/2 W",
      "timeEleven": "11:00",
      "shorthandExample2": "grugru 3ad/2juv/5subad s +-",
      "timeTwelwe": "12:00",
      "netopened": "Avattu",
      "netclosed": "Suljettu",

      "speciesTotal": "Lajit lkm",
      "duration": "Kesto",
      "latestDays": "Viimeisimmät päivät",

      "vakioTitle": "Vakiomuutoseuranta",
      "otherTitle": "Muu havainnointi",
      "newPeriod": "Uusi jakso",

      "addObservations": "Lisää havaintoja",

      "chooseObservatory": "Valitse lintuasema",
      "currentObservatory": "Valittu asema: ",

      "species": "Laji",
      "count": "Lukumäärä",
      "totalCount": "Muutto Yht",
      "constantMigration": "Vakio",
      "otherMigration": "Muu muutto",
      "nightMigration": "Yömuutto",
      "scatteredMigration": "Hajahavainnot",
      "localTotal": "Paikalliset Yht",
      "localCount": "Paikalliset",
      "localGau": "Paikalliset Gåu",
      "direction": "Suunta",
      "bypassSide": "Ohituspuoli",

      "lineError": "Virhe rivillä ",
      "Row ": "Rivi ",
      "Odd number of times!": "Pariton määrä aikoja!",
      "Start time missing!": "Rivi {{row}}: aloitusaika puuttuu!",
      "Unknown species!": "Tuntematon lajinnimi!",
      "Missing space after species name": "Lajinimen jälkeen puuttuu välilyönti",
      "Unknown age": "Tuntematon ikä",
      "Unknown sex": "Tuntematon sukupuoli",
      "Unknown direction": "Tuntematon ilmansuunta",
      "One observation has multiple ages": "Yhdellä havainnolla on monta ikää",
      "Number after direction": "Ilmansuunnan jälkeen tulee numero",
      "Extra period or colon": "Ylimääräinen piste tai kaksoispiste",
      "Extra commas": "Ylimääräisiä pilkkuja",
      "Unknown bypass side": "Tuntematon ohituspuoli",
      "Bypass side needs to come last": "Ohituspuolen pitää olla viimeisenä",
      "Extra slashes": "Ylimääräisiä kauttaviivoja",
      "Incorrect brackets": "Virheelliset sulut",
      "Empty observation": "Tyhjä havainto",
      "Unknown character": "Tuntematon merkki",
      "Check row": "Tarkista rivi {{row}}:",

      "links": "Linkit",

      "rowsPerPage": "Rivejä sivulla: ",
      "all": "Kaikki",
      "to": ", Yhteensä: ",

      "checkShorthand": "Tarkista pikakirjoitus",

      "Observation activity": "Havaintoaktiivisuus",
      "vakiohavainto": "Vakiohavainnointi",
      "gåu": "Gåulla käynti",
      "rengastusvakio": "Rengastusvakio",
      "pöllövakio": "Pöllövakio",
      "nisäkkäät": "Nisäkkäät yms. laskettu",
      "liitteet": "Liitteitä",
      "Are you sure you have this many attachments?": "Oletko varma, että liitteitä oli näin monta?",
      "pcs": "kpl",
      "no negative values": "Negatiivinen arvo!",
      "Please recheck that you mean to declare that many attachments": "Olet ilmoittamassa poikkeuksellisen ison määrän liitteitä. Tarkistathan, että syöttämäsi summa on oikein.",
      "no empty values": "Arvo puuttuu!",

      "Catches":"Pyydykset",
      "was open": "Auki",
      "amount":"Lkm",
      "length": "Pituus (m)",
      "No catches declared":"Ei ilmoitettuja pyydyksiä.",
      "Please recheck that you mean to declare that many catches": "Pyydysten määrä on huomattavan suuri, Tarkistathan, että se on oikein.",
      "Net length is usually between 9 and 12 meters. Please check that your value is right.": "Verkon pituus on yleensä 9-12 metriä. Tarkistathan, että syötit tarkoittamasi pituuden.",

      "Modify": "Muokkaa",
      "Observation period": "Havaintojakso",
      "at": "kello"

    },
  },
};
export { resources };