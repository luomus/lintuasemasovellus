Tietokantayhteyttä varten tarvitset oracle-client ohjelman koneellesi.

[Lataa täältä] (https://www.oracle.com/database/technologies/instant-client/linux-x86-64-downloads.html) tiedosto nimeltä "Basic Light Package (ZIP) ". Pura se koneellesi.

Aja sen jälkeen komentoriviltä komennot (esimerkissä tiedosto ollut Desktop-kansiossa):

sudo sh -c "echo $HOME/Desktop/instantclient_19_8 > \
      /etc/ld.so.conf.d/oracle-instantclient.conf"


sudo ldconfig
