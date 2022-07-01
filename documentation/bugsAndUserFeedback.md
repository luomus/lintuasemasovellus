# Bugeja, ongelmia ja käyttäjäpalautteesta

## Hyvä tietää Oraclesta

1. Oracle ei siedä isoja kirjaimia tietokantataulujen tai sarakkeiden nimissä.

2. Oracle ei siedä user-nimeä tietokantataulussa. Ohjelmassa “account”-nimellä. Jotkin yleiset sarakenimet kuten "row" ovat myös kiellettyjä.

3. Oracle lisää id:itä täysin satunnaisessa järjestyksessä.

4. Oracle ei ole yhteensopiva joidenkin sqlalchemyn metodien kanssa, kuten flush() ja refresh(), joiden avulla voi esim. selvittää lähetettävän olion id:n.

5. Mikäli haluaa käyttää sqliteä testauksessa, on hyvä tiedostaa, että Oracle ja sqlite toimivat toimii eri tavalla.

## Tiedossa olevia bugeja ja keskeneräisyyksiä

Nämä löytyvät Github-repositorion Issues-välilehdeltä.

## Loppuvuodesta 2020 saadusta käyttäjäpalautteesta havaintoja, jota ei ole korjattu
 
1. Kellonajat ja päivämäärät sekä tallennus:  

> Käyttäjä3:

> Aloin kirjottaa haviksia, omaa hölmöyttäni, aluksi tuohon kommenttikenttään. Huomasin siinä samalla, että kun vaihdoin päivämäärän 03.12.2020 - > 01.07.1995, niin havainnoija(t)- ja kommentti-kentät tyhjenevät. Havis-kenttä ei tyhjene. Myös päivämäärä on pakko kirjoittaa muodossa pp.kk.vvvv. Se on pieni juttu, mutta esim. Tiiraanhan voi laittaa 1.7.1995 eikä sen tarvitse olla 01.07.1995

2. Vain yksi laji per rivi: 

> Eli ei sallita esim. rivejä 

> > Sommol 1, Anapla 22/12  

> vaan pitäisi tallentaa 

> > Sommol 1

> > Anapla 22/12 

> (Kehittäjien kokeillessa tätä saatiin virheilmoitus: Tuntematon merkki: n )

3. Validointiasiaa:  

> -Errorviesti puuttuu, jos jättää nimen tai havaintopaikan pois (Haliaksella), tallentaa ei kuitenkaan voi

> -Havaintoja voi tallentaa tulevaisuuteen, ei herjaa 

> -Vakiota voi staijata kahdessa eri paikassa samaan aikaan. Pitäisi saada tehdä vakiota vain yhdessä paikassa.

## Kesän 2022 ryhmän keskeneräisyydet ja kehitysehdotukset

Kesän 2022 ryhmän ylläpitämä backlog löytyy [Trellosta](https://trello.com/b/8FSrc8SY/backlog). Kohdassa "Product Backlog" on listattu kortit kullekin avoimeksi jääneelle kehitysidealle tai puutteelle. Nämä on koostettu arkistojen (edellisen ryhmän backlog, Github issuet), asiakkaan välittämän palautteen ja projektin aikana tehtyjen havaintojen pohjalta.

Sovellus toimii tällä hetkellä vain Hangon lintuasemalle. Ainakin locations.json - tiedostoa ja joitain backendin funktioita pitää muuttaa,
jotta sovellus toimisi samalla tavalla esimerkiksi Jurmon asemalle. Paikallisen havainnon lisäämistä hoitavat funktiot hakevat aina 
Hangon lintuaseman id:n, ja paikallisten havaintojen sijainniksi tulee nyt aina Bunkkeri, mikä ei välttämättä ole olemassa muilla asemilla.
Näiden kutsujen tulisi siis pyytää lintuaseman nimi frontendistä ja keksiä sijainniksi jokin lintuaseman omista paikoista. 

Toinen tärkeä asia on sovelluksen skaalaaminen. Emme ehtineet simuloida suurta määrää dataa tai tuoda vanhaa dataa, joten emme päässeet käytännössä
kokeilemaan sovelluksen toimivuutta satojen tuhansien tai jopa miljoonien havaintojen kanssa. Havaintoja tulee siis noin 100,000 vuodessa, eli
sovelluksen tulisi toimia nopeasti myös muutaman miljoonan rivin taululla. Jos hidastumista tapahtuu, se tapahtuu käytännössä observations-taulun
yhteydessä, jolloin yksi ensimmäisistä keinoista olisi taulun indeksoinnin tarkistaminen. Etenkin observationperiod_id - kolumnin voisi indeksoida.
Me uskomme kuitenkin että huomattavaa hidastumista tuskin tulisi, sillä monet raskaimmista backendin kutsuita on toteutettu melkein täysin
 SQL komentoina, mikä nopeuttaa tiedon hakemista. 

Lajimäärittelyyn liittyen on listattu huomoita (konfiguroinnin kehittäminen, nisäkkäiden puute) sitä käsittelevässä [dokumentissa](./developmentInstructions/aboutDefinedSpecies.md#huomioita).
