# Sovelluksen käyttämistä lintulajeista

_Huomioita kesältä 2022._

Sovellus käyttää kahta frontendiin määriteltyä tiedostoa, jonka perusteella päätellään käytettävissä olevat lintulajit: 
1. [birds.json](../frontend/src/birds.json) ja
2. [defaultBirds.json](../frontend/src/defaultBirds.json).

Molemmissa tiedostoissa sekä itse sovelluksessa käytetään lajien tunnisteina näiden kuusikirjaimisia lyhenteitä. Esimerkiksi kyhmyjoutsenta vastaava tunniste on "CYGOLO", joka tulee tämän tieteellisestä nimestä "Cygnus olor". Tämä vastaa Luomuksen käytössä olevien asemakohtaisten lajilistojen (esim. _Halias_sp_v1.6.csv_) kentän `Species_Abb` tietoa. 
![image](https://user-images.githubusercontent.com/47885648/176842971-6c828b67-75c6-481c-a552-2c27b8d1f482.png)

Lajit tulee olla listattuna lajikoodin (`Species_code`) mukaisessa kasvavassa järjestyksessä. 

![image](https://user-images.githubusercontent.com/47885648/176842793-03fa7b1f-38e9-41fe-89c4-9d621d1b82e4.png)

Tätä koodia ei toistaiseksi ole sisällytetty tiedostoihin, sillä riittää, että lajit on tallennettu valmiiksi oikeassa järjestyksessä. Järjestäminen on tehty ennen tietojen kopioimista lähdeaineistosta Google Sheetillä muun muotoilun yhteydessä.

Tällä hetkellä lähdeaineistona on käytetty _Halias_sp_v1.6.csv_ tiedostoa.

## 1. birds.json

Tiedoston pääasiallinen käyttötarkoitus on alun perin ollut validoida pikakirjoituksen syöte ja muuttaa mahdollinen lajin synonyymi lajin varsinaiseksi, lähdeaineiston mukaiseksi lyhenteeksi ennen tallennusta. Tiedosto sisältää siis avain-arvo-pareja, joissa avain vastaa joko lajin varsinaista lyhennettä tai käytettyä lyhennettä. Tietokantaan tallennettava arvo puolestaan määräytyy avainta vastaavan arvo-kentän (`value:`) mukaan. Näin siis jokaiselle lajille on vähintäänkin avain-arvo-pari, jossa sekä avain että arvo ovat samat. Jos kyseessä on synonyymi, on avain eri kuin arvo. Yleisesti muoto on siis:

```json
"synonyymi/kohdelyhenne" : { "value": "kohdelyhenne" }
```

Esimerkiksi kyhmyjoutsenelle löytyy kaksi syötettä, joista ensimmäinen varmistaa, että varsinainen lyhenne hyväksytään ja tallennetaan sellaisenaan ja toinen mahdollistaa myös lyhenteen `COLO` käyttämisen pikakirjoituksessa:
```json
  "CYGOLO": {
    "value": "CYGOLO"
  },
  "COLO": {
    "value": "CYGOLO"
  },
```

Kesällä 2022 laajennettiin päiväkohtaisen näkymän toteutusta niin, että käyttäjä pääsee näkemään myös lajeja, joille ei ole vielä syötteitä. Tätä varten kyseinen tiedosto päivitettiin edellä mainittu lajijärjestys huomioiden. Siitä luetaan tiedostossa [globalConstans.js (rivi43)](https://github.com/luomus/lintuasemasovellus/blob/20a7be89f50924d2cf404e467dcdc0f5bef39c3c/frontend/src/globalConstants.js#L43) `value`-kentän arvot sarjaksi, joka välitetään listana sovelluksen käyttöön. Näin saadaan kaikkien määriteltyjen lajien tunnisteet siinä muodossa kuin ne tallennetaan ilman duplikaatteja (siitä palautettavan listan nimi `uniqueBirds`).

Huomaa, että tiedoston vanhassa versiossa havaittiin olevan 15 lajia synonyymeineen lähdemateriaalin lisäksi, jotka jätettiin mukaan listauksen perään. Nämä ovat (poimi tarvittaessa mukaan päivittäessäsi listaa):
```json
"LYRTET": { "value": "LYRTET" },
"LIMFAL": { "value": "LIMFAL" },
"PHIPUG": { "value": "PHIPUG" },
"LARMIN": { "value": "LARMIN" },
"STECAS": { "value": "STECAS" },
"NYCSCA": { "value": "NYCSCA" },
"LUSCYA": { "value": "LUSCYA" },
"SAXRUB": { "value": "SAXRUB" },
"SAXTOR": { "value": "SAXTOR" },
"PARMON": { "value": "PARMON" },
"PARCIN": { "value": "PARCIN" },
"PARCRI": { "value": "PARCRI" },
"PARATE": { "value": "PARATE" },
"PARCAE": { "value": "PARCAE" },
"PARCYA": { "value": "PARCYA" },
"TTET": { "value": "LYRTET" },
"LFAL": { "value": "LIMFAL" },
"PPUG": { "value": "PHIPUG" },
"LMINU": { "value": "LARMIN" },
"SCAS": { "value": "STECAS" },
"NSCA": { "value": "NYCSCA" },
"LCYA": { "value": "LUSCYA" },
"SRUB": { "value": "SAXRUB" },
"STOR": { "value": "SAXTOR" },
"PRMON": { "value": "PARMON" },
"PCIN": { "value": "PARCIN" },
"PATE": { "value": "PARATE" },
"PCAE": { "value": "PARCAE" },
"PCYA": { "value": "PARCYA" }
```

Listaa päivittäessä kannattaa käyttää esimerkiksi, jotain taulukkolaskentaohjelmaa kuten Google Sheettia vaaditun muotoilun toteuttamiseksi sekä tiedoston sisällön ja päivitetyn lähdemateriaalin vertailussa. 

Pääpiirteissään kesällä 2022 tehty päivitys eteni siten, että:
1. Vietiin sekä birds.json että Halias-data Google Sheettiin omiksi taulukoikseen.
2. Vertailtiin näiden sisältöjä ja luotiin lista jossa on kaikki Haliaksesta löytyneet lajit sekä näiden birds.json määritellyt synonyymit että Haliaksesta puuttuneet mutta birds.json löytyneet lajit. Muun muassa `VLOOKUP`-funktio oli hyödyllinen listojen sisältöjen ja mahdollisten arvojen haussa taulukoiden välillä.
3. Kun lista avain- ja arvo-pareista oli valmis, muotoiltiin se vielä vastaamaan `json`-tiedoston kirjoitusasua (kuvassa esimerkki) ja kopioitiin muotoilun sisältävän sarakkeen sisältö birds.json-tiedostoon korvaten tämän vanhan sisällön.
![image](https://user-images.githubusercontent.com/47885648/176877900-7c9a9a96-6bdd-436d-b30b-8d54365d1d39.png)

## 2. defaultBirds.json

Tämä tiedosto otettiin käyttöön kesän 2022 toteutuksessa. Tiedostossa määritellään asemakohtaiset peruslajit. Sen syötteet ovat muotoa
```
{ "aseman1_tunniste: [ "laji1", "laji2", "laji3", ... ] , aseman2_tunniste: [ "laji2", "laji4", "laji5", ... ], ... }
```

Toisin sanoen, jokainen asemalle listattu lajilyhenne tarkoittaa, että lyhennettä vastaava laji on aseman peruslaji. Jos lyhenne puuttuu, se ei ole peruslaji. Hangon aseman tapauksessa listalta löytyy `"CYGOLO"`, muttei `"CYGCOL"`, joten kyhmyjoutsen on Hangon aseman peruslaji, pikkujoutsen ei.

Tiedot on poimittu lähdemateriaalista kentän `Peruslaji` avulla suodattamalla listauksesta vain lajit, joilla kentän arvo on `1` (muilla lajeilla tämä on `0`) - säilyttäen samalla `Species_code` järjestyksen.

![image](https://user-images.githubusercontent.com/47885648/176873860-f0d330bf-3950-4c1e-8ca3-95ed2f3bbdfc.png)
Huomaa, että jokaista käytettävissä olevaa asemaa vastaavalle tunnisteelle on löydyttävä vähintään tyhjä lista kuten nyt Jurmon tapauksessa on (`"Jurmon_asema: []"`).

Tiedoston sisältö luetaan tiedostossa [globalConstans.js](../frontend/src/globalConstants.js) ja välitetään muun sovelluksen osien käytettäväksi. Listaa tarvitaan päiväkohtaisen näkymän lajilistauksen suodattamisessa, mikäli käyttäjä haluaa nähdä vain aseman peruslajit tai muut kuin peruslajit.

## Huomioita

### Lajien konfiguroinnista

Tällä hetkellä sovelluksessa on siis kaksi erillistä lajit määrittelevää tiedostoa. Kaikki tarvittava tieto voisi yhtä hyvin liittää yhteen `birds.json`-tiedostoon. Siihen voisi liittää mukaan myös muuta tietoa kuten `Species_code`-kentän tai vaikkapa lajin koko nimen mukaan. Muoto voisi olla esimerkiksi:
```json
"species": {
  "abb": "CYGOLO",
  "code": "2",
  "synonyms": "COLO",
  "fin_name": "kyhmyjoutsen",
  "..."
}
```
Tosin nykyisellään ainakin peruslajit on suhteellisen helppo päivittää, kun ylimääräisiä kenttiä ei ole tässä mukana.

Toisaalta, lajilista voisi yhtä hyvin olla sovelluksen backendin vastuulla, sillä siellä määritellään muut asemakohtaiset tiedot kuten havainnointipaikat ja -tyypit (kts. [locations.json](lintuasema-backend/application/locations.json)). Tiedot voisi yhtä hyvin olla myös tietokannassa omana taulunaan, jolloin se mahdollistaisi konfiguroinnin sovelluksesta käsin (edellyttäen toki tuen tähän rajapintaan sekä käyttöliittymään).

### Sisällöstä

Listoissa ei tällä hetkellä ole otettu mukaan nisäkkäitä.
