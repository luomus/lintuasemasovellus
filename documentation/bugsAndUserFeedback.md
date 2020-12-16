# Bugeja, ongelmia ja muita ikäviä asioita

## Oraclessa asuu pahuus

1. Oracle ei siedä isoja kirjaimia tietokantataulujen tai sarakkeiden nimissä.

2. Oracle ei siedä user-nimeä tietokantataulussa. Ohjelmassa “account”-nimellä. Jotkin yleiset sarakenimet kuten "row" ovat myös kiellettyjä.

3. Oracle lisää id:itä täysin satunnaisessa järjestyksessä, turha lähteä ennustamaan seuraavaa id:tä.

4. Oracle ei ole yhteensopiva joidenkin sqlalchemyn metodien kanssa, kuten flush() ja refresh(), joiden avulla voi esim. selvittää lähetettävän olion id:n.
Siis lähetettävän olion id:n selvittäminen on hyvin vaivalloista Oraclen kanssa.

5. Voi tuntua hyvältä idealta käyttää sqliteä testauksessa. Ei kannata. Oracle ja sqlite toimii eri tavalla.

## Tiedossa olevia bugeja

1. Jos pikakirjoituksesta poistaa yhden lajin, seuraa virheviesti.

2. jos havaintoon kirjoittaa duplikaatteja aloitus- ja lopetusaikoja tai havaintorivejä, niin poistaminen ja muokkaus eivät toimi. Ongelma observationPeriodin poistamisessa.

3. lisättäessä samalle päivälle sama havainto. Jos ekalle on laitettu esim. vakio ja bunkkeri. Seuraavalle laitetaan yömuutto ja bunkkeri. Tällöin jälkimmäisen havainnon tiedot menevät vakiolle ja yömuutolla ei ole mitään.

4. Jos kirjoittaa ensin havainnoitsijan ja vaihtaa sen jälkeen päivämäärän niin havainnoija katoaa tapauksessa jossa valitulle päivälle ei löydy havainnoijia ennestään.

5. Etusivulla havainnoitsija ja kommentti eivät ilmesty automaattisesti muuten kuin avaamalla kalenteri ja valitsemalla päivä. Kenttien kuuluisi toimia niin, että kirjottamalla päivämäärä tai kun etusivu avataan (ja oletuspäivällä on jo kommentti ja havainnoija) niin havainnoitsija ja kommentoija ilmestyvät näkyviin.

6. Päivämääräbugi -> jos kirjoittaa manuaalisesti ei-validin päivämäärän (esim. 37.1.), niin tieto menee tietokantaan oudosti.

##  Muuta keskeneräistä

Tärkein: tehokkuusongelma. Pitkän pikakirjoituspötkön lähettäminen on tällä hetkellä hyvin hidasta. 100-rivisessä voi mennä esim. yli 30 sekuntia.
Tähän on jo aloitettu jotain, kuten backendissä api/addEverything route. Idea oli lähettää kaikki tiedot yhdessä db sessionissa (https://docs.sqlalchemy.org/en/14/orm/persistence_techniques.html#bulk-operations). Aika loppui kesken ja tuli Oracle ongelmia tuon suhteen.

1. Kenttiin tarvitaan lisää validointia. Kenttien ei pidä sallia esimerkiksi syötteitä jotka koostuvat vain välilyönneistä. Päivämäärien pitää olla todellisia päivämääriä, ja niin edelleen.
2. Lisätarkistus: Yömuuton kellonajan tulisi sisältää tarkistus siitä, että kyseinen kellonaika on yöllä.
3. Käyttäjälle tarvitaan ilmoituksia tilanteissa joissa vanhoja tietoja ladataan. Esimerkkinä tilanne jossa päivälle on jo olemassa havainnoijat ja kommentti.

4. Etusivun havaintolomakkeessa on kenttiä jotka täytyy täyttää jotta lomakkeen voi lähettää. Tyhjäksi jääneille kentille tarvitaan jonkinlainen virheviesti.
5. Soft delete on osittain keskeneräinen. Ideana on, että jos tietokannasta poistetaan jotakin, merkitään sarakkeen is_deleted arvoksi 1. Vastaavasti kohdilla joita ei ole poistettu arvo on 0. Tämän avulla pystytään seuraamaan mitä tietokannassa on tapahtunut.
Soft delete toimii nyt oikein lukuun ottamatta pikakirjoituksen kautta poistettuja havaintoja, jotka tällä hetkellä poistetaan kokonaan tietokannasta. Tätä pitäisi siis muokata niin, että kun pikakirjoituksen kautta poistetaan jotakin, tulee poistetun kohdan is_deleted arvoksi 1 ja uuden 0.


## Käyttäjäpalautteesta se osa, jota ei ole korjattu


1. Punainen virheilmoitus kellonajoista koettiin ongelmalliseksi: 

> kellonaikajaksojen error voisi tulla vasta kun ollaan tallentamassa eli tekee validoinnin vasta tässä kohtaa eikä päästä läpi jos ongelmia kellonaikajaksoissa. 

> Käyttäjä1: Punaisella tulee virheilmoitusta heti kun alkaa kirjoittaa havainnon kellonaikaa: "Havaintorivien täytyy olla aikojen sisällä." Tätä lausetta ei myöskään ole ihan helppo ymmärtää. Ainakin ensiyrittämällä virheilmoituksen näkyminen melkein koko ajan tuntuu häiritsevältä – ehkä vakiohavaintoja kirjattaessa ohjelma voisi automaattisesti syöttää aloitusajan alle myös jakson päättymisajan? Ohessa pari kuvakaappausta, joissa identtiset havainnot, mutta vain toisessa tallentamislinkki muuttui vihreäksi.  (1_käyttäjä1)

> Käyttäjä2: Kellonaikaerrori hämmentää minuakin, mulla ei antanut ollenkaan tehdä enempää kuin yhden jakson eli sanoo että havaintorivien täytyy olla aikojen sisällä, vaikka viimeisenä olisi kellonaika, jos jaksoja on enemmän kuin yksi eli havaintorivien välissä on kellonaika (1_käyttäjä2 testi3, testi4).  

 
> Ihmetellessäni tuota useamman jakson ongelmaa, niin kun poistin kaiken ensimmäisen jakson loppukellonajan jälkeen niin yhtäkkiä ohjelma ei ilmeisesti tunnistanutkaan enää lyhennettä "smol" joka oli aiemmin ollut ok (1_käyttäjä2  testi2). Tämä errori lähti pois kun muutti "smol" muotoon "sommol" mutta ei tullut takaisin enää vaikka muutti takaisin muotoon "smol". 

 

 

2. Virhetarkistus tulisi tulla vasta siinä vaiheessa, kun riviltä on siirrytty pois: 

> Käyttäjä 2: 

> Mun mielestä olisi hyvä että errorien tarkastus koskisi tiettyä riviä vasta siinä vaiheessa kun siltä on siirtynyt pois painamalla entteriä: nyt sain aikaan semmoisen että kun edellisellä rivillä lukee "fc 5", painan entteriä ja kirjoitan seuraavalle riville "g" kirjoittaakseni "gavarc" niin ohjelma alkaa "g":n kohdalla välittömästi herjata että tuntematon merkki "g" rivillä 5 (eli edellisellä rivillä jossa on tuo "fc 5"). En tajunnut ottaa screenshottia ja en nyt heti saa duplikoitua tuota erroria vaikka yritin.  (2_käyttäjä2)


3. Kellonajat ja päivämäärät sekä tallennus:  

> Käyttäjä3:

> Aloin kirjottaa haviksia, omaa hölmöyttäni, aluksi tuohon kommenttikenttään. Huomasin siinä samalla, että kun vaihdoin päivämäärän 03.12.2020 - > 01.07.1995, niin havainnoija(t)- ja kommentti-kentät tyhjenevät. Havis-kenttä ei tyhjene. Myös päivämäärä on pakko kirjoittaa muodossa pp.kk.vvvv. Se on pieni juttu, mutta esim. Tiiraanhan voi laittaa 1.7.1995 eikä sen tarvitse olla 01.07.1995


4. Vain yksi laji per rivi: 

> Eli ei sallita esim. rivejä 

> Sommol 1, Anapla 22/12  

> > vaan pitäisi tallentaa 

> Sommol 1

> Anapla 22/12 

> (Kehittäjien kokeillessa tätä saatiin virheilmoitus Error in line 2, Sommol 1, Anapla 22/12 : tuntematon merkki: n )


5. Tallenna näppäimessa ongelmia (pitikö vielä toimia?) 

> Käyttäjä 1:

> Tallentaminen ei onnistunut ("Lomakkeen lähetyksessä ongelmia. Tarkista internetyhteys"), joten en tiedä miten ohjelma olisi tulkinnut vikan havainnon johon ei ole kirjattu lajia. 


6. Validointiasiaa: (nice to have tässä vaiheessa) 

> Käyttäjä 4: 

> -Errorviesti puuttuu, jos jättää nimen tai havaintopaikan pois (Haliaksella), tallentaa ei kuitenkaan voi

> -Havaintoja voi tallentaa tulevaisuuteen, ei herjaa 

> -Vakiota voi staijata kahdessa eri paikassa samaan aikaan. Pitäisi saada tehdä vakiota vain yhdessä paikassa.


> -Tallentuuko jonnekin, kuka on tallentanut havainnot? Onko jatkossa tarkoitus, että kuka vaan voi omalla tunnuksellaan tallentaa havaintoja asemien tileille, voiko tästä seurata ilkivaltaa, jossa joku hassu tyyppi tekee hassuja aliaksia ja tallentaa pikkukotkahavaintoja? 

