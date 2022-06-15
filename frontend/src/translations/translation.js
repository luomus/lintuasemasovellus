const resources = {
  fi: {
    translation: {
      // site-wide, headers
      "intro": "Tervetuloa lintuasemasovellus Haukkaan. Suomessa sijaitsee 16 lintuasemaa. Lintuasemasovelluksen avulla käyttäjä voi kirjata lintuasemilla tehtyjä lintujen havaintotietoja vakioidussa muodossa. Havaintojen tallentaminen järjestelmään vaatii sisäänkirjautumisen.",
      "footer": "Lintuasemasovellus Haukka | Luonnontieteellinen keskusmuseo LUOMUS",
      "login": "Kirjaudu sisään",
      "logout": "Kirjaudu ulos",
      "User": "Käyttäjä",
      "frontpage": "Etusivu",
      "addDayPage": "Lisää päivä",
      "showDaysPage": "Näytä päivät",
      "observatory": "Lintuasema",
      "summary": "Lajit",
      "obsPeriods": "Jaksot",
      "manualTitle": "Käyttöohjeet",
      "manualTextShort": "Tähän kirjoitetaan lyhyt versio sovelluksen käyttöohjeista.",
      "manualText": "Tähän kirjoitetaan sovelluksen käyttöohjeet kokonaisuudessaan.",
      "speciesTotal": "Lajit lkm",
      "changeObservatory": "Vaihda lintuasemaa",
      "chooseObservatory": "Valitse lintuasema",
      "currentObservatory": "Valittu asema: ",
      "rowsPerPage": "Rivejä sivulla: ",
      "all": "Kaikki",
      "to": ", Yhteensä: ",
      "links": "Linkit",
      "direction": "Suunta",
      "bypassSide": "Ohituspuoli",
      "scatteredMigration": "Hajahavainnot",
      "latestDays": "Viimeisimmät päivät",
      "obsPeriod": "Havaintojakso",
      "at": "kello",

      // form texts
      "date": "Päivämäärä",
      "observers": "Havainnoija(t)",
      "observations": "Havainnot",
      "migrantObservations": "Muuttohavainnot",
      "comment": "Havainto- ja pyydyskommentit",
      "commentAdded": "Kommentteja kirjattu",
      "noComment": "Ei kommentteja",
      "catchType": "Pyydys",
      "netCodes": "Verkkokoodit",
      "catchArea": "Pyyntialue",
      "netLength": "Verkon pituus",
      "catchCount": "Lukumäärä",
      "copy": "Kopioi edellinen päivä",
      "chooseCopy": "Valitse edelliseltä päivältä kopioitavat tiedot.",
      "draftInfoText": "Valitse palautettava luonnos.",
      "overwrite": "Huom! Valitut tiedot ylikirjaavat mahdolliset kyseiseen kohtaan tälle päivälle tehdyt merkinnät.",
      "days": "Päivät",
      "observationStation": "Havainnointiasema",
      "formSent": "Lomake lähetetty!",
      "formNotSent": "Lomakkeen lähetys ei onnistunut.",
      "readMore": "Lue lisää",
      "location": "Sijainti *",
      "observationperiod": "Havaintoperiodi",
      "observation": "Havainto",
      "type": "Tyyppi *",
      "startTime": "Alkuaika",
      "endTime": "Loppuaika",
      "chooseTypeAndLocation": "(Valitse tyyppi ja sijainti)",
      "netopened": "Avattu",
      "netclosed": "Suljettu",
      "duration": "Kesto",
      "addObservations": "Lisää havaintoja",
      "species": "Laji",
      "count": "Lukumäärä",
      "totalCount": "Muutto Yht",
      "constantMigration": "Vakio",
      "otherMigration": "Muu muutto",
      "nightMigration": "Yömuutto",
      "localTotal": "Paikalliset Yht",
      "localCount": "Paikalliset",
      "localGau": "Paikalliset Gåu",
      "ObservationActivity": "Havaintoaktiivisuus",
      "observationActivityAdded": "Havaintoaktiivisuus kirjattu",
      "noObservationActivity": "Ei havaintoaktiivisuusmerkintöjä",
      "catches": "Pyydykset",
      "catchesAdded": "Pyydystietoja kirjattu",
      "noCatches": "Ei pyydyksiä",
      "errorsInCatches": "Virheitä pyydyksissä!",
      "wasOpen": "Auki",
      "amount": "Lkm",
      "length": "Pituus (m)",
      "noCatchArea": "Valitse pyyntipaikka jatkaaksesi",
      "noCatchesDeclared": "Ei ilmoitettuja pyydyksiä.",
      "standardObs": "Vakiohavainnointi",
      "gåu": "Gåulla käynti",
      "standardRing": "Rengastusvakio",
      "owlStandard": "Pöllövakio",
      "mammals": "Nisäkkäät yms. laskettu",
      "attachments": "Liitteitä",
      "pcs": "kpl",
      "notes": "Lisätiedot",
      "drafts": "Luonnokset",

      // buttons & confirmation
      "cancel": "Peruuta",
      "remove": "Poista",
      "confirm": "Vahvista",
      "confirmDeletion": "Vahvista poisto",
      "oneSpecies": "laji",
      "multipleSpecies": "lajia",
      "edit": "Muokkaa",
      "editObservations": "Muokkaa havaintoja",
      "editShorthand": "Muokkaa pikakirjoitusta",
      "removingCannotBeCancelled": "Poistamista ei voi peruuttaa. Jatketaanko?",
      "observationPeriodNotDefined": "Havaintojaksoa ei ole määritelty!",
      "noObservationsFound": "Havaintotietoja ei löytynyt tälle päivälle.",
      "addRowByClicking": "Lisää pyydys painamalla '+'.",
      "rowRemoved": "Pyydysrivi poistetaan. Vahvista painamalla 'Poista'.",
      "modify": "Muokkaa",
      "save": "Tallenna",
      "saveMigrant": "Tallenna muuttohavainnot",
      "helpForSaveMigrantButton": "Tallenna syötetyt muuttohavainnot valitulla havaintotyypillä ja -sijainnilla. Syötäthän lisäksi havainnoitsijan tiedot sille osoitettuun kenttään ennen tallentamista. Myös muiden kenttien tiedot (kommentit, aktiivisuus, pyydykset) tallennetaan.",
      "loading": "Ladataan...",
      "toDayDetails": "Siirry koontinäkymään",
      "helpForToDayDetailsButton": "Siirry valitun päivän koontinäkymään. Syötäthän havainnoitsijan, jos kenttä on tyhjä, jotta painike aktivoituu.",
      "showOnlyBirdsWithObservations": "Näytä vain lajit, joista on havaintoja",
      "speciesTextFilter": "Lajihaku",

      // notifications & errors
      "periodsTimesMustBeDifferent": "Aloitus- ja lopetusajan on oltava eri",
      "invalidDate": "Virheellinen päivämäärä",
      "maxDateError": "Päivämäärä on liian suuri",
      "minDateError": "Päivämäärä on liian pieni",
      "periodSaved": "Lomake tallennettu tietokantaan",
      "periodNotSaved": "Lomakkeen tallennuksessa ongelmia.",
      "lineError": "Virhe rivillä ",
      "oddNumberOfTimes": "Pariton määrä aikoja",
      "startTimeMissing": "Aloitusaika puuttuu",
      "unknownSpeciesError": "Tuntematon lajinnimi",
      "missingSpaceAfterSpecies": "Lajinimen jälkeen puuttuu välilyönti",
      "unknownAge": "Tuntematon ikä",
      "unknownSex": "Tuntematon sukupuoli",
      "unknownDirection": "Tuntematon ilmansuunta",
      "observationHasMultipleAges": "Yhdellä havainnolla on monta ikää",
      "numberAfterDirection": "Ilmansuunnan jälkeen tulee numero",
      "extraPeriodOrColon": "Ylimääräinen piste tai kaksoispiste",
      "extraCommas": "Ylimääräisiä pilkkuja",
      "unknownBypassSide": "Tuntematon ohituspuoli",
      "bypassSideNotLast": "Ohituspuolen pitää olla viimeisenä",
      "extraSlashes": "Ylimääräisiä kauttaviivoja",
      "incorrectBrackets": "Virheelliset sulut",
      "emptyObservation": "Tyhjä havainto",
      "unknownCharacter": "Tuntematon merkki: {{char}}",
      "checkRow": "Tarkista rivi {{row}}: ",
      "checkShorthand": "Tarkista pikakirjoitus",
      "errorsInObservationActivity": "Virheitä havaintoaktiivisuusmerkinnöissä!",
      "valueIsNegative": "Negatiivinen arvo!",
      "recheckLargeNumberOfAttachments": "Olet ilmoittamassa poikkeuksellisen ison määrän liitteitä. Tarkistathan, että syöttämäsi summa on oikein.",
      "valueMissing": "Arvo puuttuu!",
      "noNegativeValues": "Negatiiviset arvot eivät ole sallittuja!",
      "noEmptyValues": "Kenttä ei saa olla tyhjä",
      "changeDateWhenObservationsConfirm": "Päivän vaihtaminen hävittää tekemäsi merkinnät. Haluatko vaihtaa päivää?",
      "recheckNumberOfCatches": "Pyydysten '{{char}}' määrä on huomattavan suuri. Tarkistathan, että se on oikein ennen kuin tallennat.",
      "checkNetLength": "Verkon '{{char}}' pituus on yleensä 9-12 metriä. Tarkistathan ennen tallentamista, että syötit tarkoittamasi pituuden.",
      "closeBeforeOpen": "Pyydys '{{char}}' merkitty suljetuksi ennen avausaikaa.",
      "noZeroAmount": "Pyydyksen '{{char}}' lukumäärä ei voi olla 0.",
      "maxCatchValue": "Pyydyksen '{{char1}}' lukumäärä voi olla korkeintaan {{char2}}.",
      "expectingStandardCatch": "Rengastusvakio on merkitty tehdyksi. Lisää ainakin yksi vakioverkko.",
      "duplicateCatches": "Pyyntialueella '{{char}}' on ilmoitettu samanlainen pyydys useampaan kertaan. Tarkistathan pyydykset.",
      "periodsEndTimeMustBeAfterStartTime": "Havainnon lopetusajan on oltava aloitusajan jälkeen.",
      "pauseAlreadyActive": "Jakso on jo kirjattu tauoksi.",
      "noPauseDuringEmptyPeriod": "Havaintojakso on jo merkitty tyhjäksi, eikä voi olla tauolla.",
      "noObservationsDuringPause": "Tauolla ei voi kirjata havaintoja.",
      "alreadyEmpty": "Jakso on jo merkitty tyhjäksi.",
      "noEmptyDuringPause": "Jaksoa ei voi kirjata tyhjäksi tauolla.",
      "noObservationsDuringEmptyPeriod": "Tyhjällä jaksolla ei voi olla havaintoja.",
      "noObservations": "Jaksolle ei ole kirjattu havaintoja.",
      "mustEndWithTime": "Havaintojen on päätyttävä kellonaikaan.",

      "noRequiredRoles": "Jos tarvitset pääsyn sovellukseen, voit pyytää sitä sähköpostilla.",
    },
  },
};
export { resources };
