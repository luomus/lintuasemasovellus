#Päivänäkymässä muokattavat arvot

Päivänäkymässä muokattavat arvot ovat paikalliset havainnot, paikalliset Gåu havainnot (eli havainnot jotka tapahtuivat Gåussa) ja hajahavainnot.
Päivänäkymässä on listattuna riveittäin lajit ja niiden erilaiset havainnot kyseiselle päivälle. Tämä näkymä on kuitenkin melkoisen työn
takana tietokannassa; sitä pääsee katsomaan observation/services.py - tiedostossa. Observation-taulussa näkyy lajin nimi, lintujen määrä
sekä yksityskohtia havainnosta kuten liikkumissuunta, sukupuoli jne. Havainnon paikka ja tyyppi ovat kuitenkin observationperiod taulussa,
eli havainnon paikka ja tyyppi riippuvat käytännössä siitä, mihin havaintoperiodiin ne on tallennettu. Tämä tarkoittaa, että lisätäksemme
paikallisia havaintoja tai hajahavaintoa meidän täytyy ensin luoda niille sopivat havainnointijaksot. Muiden havaintojen jaksot luodaan pikakirjoituksen
yhteydessä, mutta näitä havaintoja muokataan päivänäkymässä, eli jakson luomisen täytyy tapahtua ennen päivänäkymään pääsyä.


Tällä hetkellä ns. "tyhjät"
havainnointijaksot luodaan uutta havainnointipäivää luodessa, joka taas luodaan päivän ensimmäisia muuttohavaintoja tallennettaessa tai ensimmäistä kertaa
koonti- eli päivänäkymään siirryttäessä. Molemmissa näissä tapauksissa kutsutaan observatorydayn addDay - funktiota, joka taas kutsuu createEmptyObsPeriodsia,
joka luo havainnointijaksot päivänäkymässä muokattaville arvoille. Nämä jaksot ovat piilotettu käyttäjältä, eli ne eivät näy jaksot - listassa.
Sitten näitä kolmea arvoa voidaan päivänäkymässä muokata nuolilla tai syöttämällä kentälle uuden arvon. Kentästä pois siirryttäessä Local- tai ScatterInput- komponentti
kerää talteen lajin nimen, annetun määrän, päivämäärän, käyttäjän id:n ja LocalInputin tapauksessa vielä sen, oliko kirjattu havainto Gåulle vai ei.
Nämä sitten annetaan services-kansion observationlistService.js:n funktiolle updateLocalObservation tai updateScatterObservation, joka suorittaa
kutsun apille observatoryday/views.py - tiedostoon, missä pyynnöstä otetaan havainnointipäivän id päivämäärän ja observatorion avulla ja sitten kutsutaan
observatory/services.py:n funktiota, joka saa parametreinä havainnointipäivän, havainnoijan userId:n, lajin nimen ja havaintojen määrän.
Näillä tiedoilla se sitten tekee uuden havainnon asiaan kuuluvaan "tyhjään" havainnointijaksoon, tai muokkaa olemassa olevaa, jos tätä arvoa
on jo tälle päivälle muokattu. Tämä sitten tallennetaan tietokantaan. 