# Frontend

Projekti käyttää frontendkehityksessä npm-paketinhallintajärjestelmää ja se on bootstrapattu create-react-app-skriptillä.

Siirry `frontend/` hakemistoon. Ajaaksesi frontendiä kehitystilassa, varmista ensin että olet asentanut tarvittavat riippuvuudet. Nämä saat asennettua ajamalla frontend-hakemistossa `npm install` ja  `npm install @mui/material @emotion/react @emotion/styled` tarvittaessa, esimerkiksi kun olet juuri kloonannut projektin. Ajamalla komennon `npm start` frontend-hakemistossa saat frontendin käynnistymään selaimeen. 

Jos haluat myös backendin käyttöön, aja lisäksi esim. toisella komentorivillä `npm run start-api` frontend-hakemistossa. Huomaa, että pythonin virtuaaliympäristön tulee olla tätä varten valmiina (katso siis edellinen kohta, API/Backend). 

Komento `npm install <paketti> --save` asentaa uuden paketin ja asettaa sen projektin ajonaikaiseksi riippuvuudeksi. Vastaavasti komento `npm install <paketti> --save-dev` asentaa uuden paketin ja asettaa sen kehitysaikaiseksi riippuvuudeksi. Riippuvuudet tallentuvat tällä tavoin package.json -tiedostoon frontend-hakemistossa. 

Komennon `npm update` ajaminen frontend-hakemistossa päivittää projektin riippuvuudet kunnioittaen samalla asetettuja semanttisia versionumeroita package.json -tiedostossa. 

