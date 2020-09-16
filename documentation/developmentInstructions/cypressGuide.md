# Ohjeet Cypress-testaukseen

## Käyttöönotto

1. Asenna uusimmat riippuvuudet (frontendissa komennolla `npm install`, backendissa komennolla `. install.sh`)
2. Käynnistä backend ja frontend
3. Navigoi (toisessa ikkunassa) frontend-alikansioon ja aja komento `npm run cypress:open`. Cypress käynnistyy uuteen ikkunaan.
4. Aja testit painamalla "run all specs" tai valitsemalla haluamasi testi ja klikkaamalla sitä. Testitulokset avautuvat selaimeen automaattisesti. 

## Testien kirjoitus

Testit sijoitetaan kansioon *.../frontend/cypress/integration*. Tänne voi halutessaan tehdä myös alikansioita selkeyden vuoksi.
