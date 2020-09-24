Tietokantayhteyttä varten tarvitset oracle-client ohjelman koneellesi.

[Lataa täältä](https://www.oracle.com/database/technologies/instant-client/linux-x86-64-downloads.html) tiedosto nimeltä "Basic Light Package (ZIP) ". Pura se koneellesi.

Aja sen jälkeen komentoriviltä komennot (esimerkissä tiedosto ollut Desktop-kansiossa):

sudo sh -c "echo $HOME/Desktop/instantclient_19_8 > \
      /etc/ld.so.conf.d/oracle-instantclient.conf"


sudo ldconfig

### Huomio

Yliopiston vpn-yhteys täytyy olla päällä, tai muuten tietokantayhteys ei toimi. Lisäksi backend-kansiossa täytyy olla tiedosto `.env`, jossa määritellään Oraclen tarvitsemat tunnistetiedot. Nämä tiedot lähetettiin taannoin sähköpostilla. Ohjeita vpn-yhteyteen: https://helpdesk.it.helsinki.fi/kirjautuminen-ja-yhteydet/verkkoyhteydet/yhteydet-yliopiston-ulkopuolelta


### Vaihtoehtoinen asennus:
`docker run banglamon/oracle193db:19.3.0-ee`
