# Ohjeet Cypress-testaukseen
## Käyttöönotto

Luo cypress.env.json niminen tiedosto frontend-kansion juureen ja laita sinne seuraavat muuttujat:
```
{
  "person_token": <test user's person token>,
  "login_port": 5000
}
```

Asenna uusimmat riippuvuudet (frontendissa komennolla npm install, backendissa komennolla . install.sh)
Käynnistä backend ja frontend erikseen. Backend käynnistetään frontend-kansiosta ja kirjoittamalla

`npm run start-api`.

Frontend käynnistetään toisessa komentorivi-ikkunassa frontend-kansiosta komennolla

`npm start`.

Navigoi (kolmannessa ikkunassa) frontend-alikansioon ja aja komento

`npm run cypress:open`.

Cypress käynnistyy uuteen ikkunaan.
Aja testit painamalla "run all specs" tai valitsemalla haluamasi testi ja klikkaamalla sitä. Testitulokset avautuvat selaimeen automaattisesti.
## Testien kirjoitus
Testit sijoitetaan kansioon `.../frontend/cypress/integration.` Tänne voi halutessaan tehdä myös alikansioita selkeyden vuoksi.
