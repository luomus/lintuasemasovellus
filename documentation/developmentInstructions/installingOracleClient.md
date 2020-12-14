# Oraclen asennus Linuxille

Tietokantayhteyttä varten tarvitset oracle-client ohjelman koneellesi.
[Lataa täältä](https://www.oracle.com/database/technologies/instant-client/linux-x86-64-downloads.html) tiedosto nimeltä "Basic Light Package (ZIP) ". Pura se koneellesi.
Aja sen jälkeen komentoriviltä komennot (esimerkissä tiedosto ollut Desktop-kansiossa):

`sudo sh -c "echo $HOME/Desktop/instantclient_19_8 >/etc/ld.so.conf.d/oracle-instantclient.conf"` 

`sudo ldconfig`

### Huomio

Oraclen asentaminen macOS -käyttöjärjestelmällä saattaa olla hieman hankalaa.

Yliopiston vpn-yhteys täytyy olla päällä, tai muuten tietokantayhteys ei toimi. Lisäksi backend-kansiossa täytyy olla tiedosto `.env`, jossa määritellään erikseen asiakkaalta/edelliseltä ryhmältä/ohjaajalta pyydettävät Oraclen tarvitsemat tunnistetiedot.

[Ohjeita VPN-yhteyden muodostamiseen](https://helpdesk.it.helsinki.fi/kirjautuminen-ja-yhteydet/verkkoyhteydet/yhteydet-yliopiston-ulkopuolelta)
