# Sovelluksen käyttämistä lintulajeista

_Huomioita kesältä 2022._

Sovellus käyttää kahta frontendiin määriteltyä tiedostoa, jonka perusteella päätellään käytettävissä olevat lintulajit: 
1. [birds.json](../frontend/src/birds.json) ja
2. [defaultBirds.json](../frontend/src/defaultBirds.json).

Molemmissa tiedostoissa sekä itse sovelluksessa käytetään lajien tunnisteina näiden kuusikirjaimisia lyhenteitä. Esimerkiksi kyhmyjoutsenta vastaava tunniste on "CYGOLO", joka tulee tämän tieteellisestä nimestä "Cygnus olor". Tämä vastaa Luomuksen käytössä olevien asemakohtaisten lajilistojen (esim. _Halias_sp_v1.6.csv_) kentän `Species_Abb` tietoa. 
![image](https://user-images.githubusercontent.com/47885648/176842971-6c828b67-75c6-481c-a552-2c27b8d1f482.png)

Lajit tulee olla listattuna lajikoodin (`Species_code`) mukaisessa kasvavassa järjestyksessä. 

![image](https://user-images.githubusercontent.com/47885648/176842793-03fa7b1f-38e9-41fe-89c4-9d621d1b82e4.png)

Tätä koodia ei toistaiseksi ole sisällytetty tiedostoihin, sillä riittää, että lajit on ttallennettu valmiiksi oikeassa järjestyksessä. Järjestäminen on tehty ennen tietojen kopioimista lähdeaineistosta Google Sheetillä muun muotoilun yhteydessä.

Tällä hetkellä lähdeaineistona on käytetty _Halias_sp_v1.6.csv_ tiedostoa.

## birds.json

Tiedoston pääasiallinen käyttötarkoitus on alun perin ollut validoida pikakirjoituksen syöte ja muuttaa mahdollinen lajin synonyymi lajin varsinaiseksi, lähdeaineiston mukaiseksi lyhenteeksi ennen tallennusta. Tiedosto sisältää siis avain-arvo-pareja, joissa avain vastaa joko lajin varsinaista lyhennettä tai käytetty lyhennettä. Tietokantaan tallennettava arvo puolestaan määräytyy avainta vastaavan arvo-kentän (`value:`) mukaan. Näin siis jokaiselle lajille on vähintäänkin avain-arvo-pari, jossa sekä avain että arvo ovat samat. Jos kyseessä on synonyymi, on avain eri kuin arvo. 

Esimerkiksi kyhmyjoutsenelle löytyy kaksi syötettä, joista ensimmäinen varmistaa, että varsinainen lyhenne hyväksytään ja toinen mahdollistaa myös lyhenteen `COLO` käyttämisen pikakirjoituksessa:
```json
  "CYGOLO": {
    "value": "CYGOLO"
  },
  "COLO": {
    "value": "CYGOLO"
  },
```

Kesällä 2022 laajennettiin päiväkohtaisen näkymän toteutusta niin, että käyttäjä pääsee näkemään myös lajeja, joille ei ole vielä syötteitä. Tätä varten kyseinen tiedosto päivitettiin edellä mainittu järjestys huomioiden. Siitä luetaan tiedostossa [globalConstans.js (rivi43)](https://github.com/luomus/lintuasemasovellus/blob/20a7be89f50924d2cf404e467dcdc0f5bef39c3c/frontend/src/globalConstants.js#L43) `value`-kentän uniikit arvot sarjaksi ja välitetään ne sovelluksen käyttöön. Näin saadaan kaikkien määriteltyjen lajien tunnisteet ilman duplikaatteja.
