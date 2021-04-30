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

