# Jatkuva käyttöönotto - CI/CD Pipeline

Lintuasemasovelluksen jatkokehityksessä on sovellettu jatkuvan integraation ja käyttöönoton periaatteita (CI/CD, continuous integration and continuous deployment). 

Sovelluksen uudet ominaisuudet toteutetaan repositoriossa aina omaan haaraansa, jossa niiden toimivuus testataan automaattisesti. Onnistuneen testauksen jälkeen toisen käyttäjän on hyväksyttävä tehdyt muutokset ennen haaran yhdistämistä master-haaraan. Master-haaran päivittyessä master-haara testataan vielä kertaalleen, ja onnistuneiden testien jälkeen master-haarasta tehty Docker-image ladataan Rahti-palvelimelle ja otetaan siellä käyttöön automaattisesti.

Automaattinen käyttöönotto on mahdollista ohittaa lisäämällä commit-viestiin tunniste *#skip*. Tällöin GitHub Actions ajaa testit, mutta uutta koodia ei lähetetä Rahti-palvelimelle.

Jatkuvan käyttöönotton automatisointi on toteutettu GitHub Actions'in avulla. Testilokeja voi käydä tutkimassa *Actions*-välilehden takaa.

## Jatkuvan käyttöönoton vaatimukset

CI/CD Pipeline on rakennettu repositorion tiedostoon [.github/workflows/main.yml](https://github.com/luomus/lintuasemasovellus/blob/master/.github/workflows/main.yml).

Automattinen käyttöönotto vaatii, että sovelluksen tuotantopalvelimen (tai erillisen staging-palvelimen) tiedot on tallennettu GitHubin *Settings*-välilehden kohtaan *Secrets*. Vaaditut tiedot ovat käyttöönottoon tarvittava osoite *RAHTI_WEBHOOK_URL* sekä palvelimelle määritetty webhook-salasana *RAHTI_WEBHOOK_SECRET*.

Mikäli halutaan käyttää automaattisia Discord-notifikaatioita, on *Secrets*-kohtaan määritettävä lisäksi halutun Discord-kanavan webhook *DISCORD_WEBHOOK*.

## Huomioita CI/CD Pipelinesta

CI/CD Pipelinen määritystiedostossa ([.github/workflows/main.yml](https://github.com/luomus/lintuasemasovellus/blob/master/.github/workflows/main.yml)) kannattaa katsoa *name:*-rivejä, joista selviää, minkälaisia asioita pipeline suorittaa.

Mikäli automaattiset Cypress-testit epäonnistuvat, voit ladata Cypress-testien ajonaikaiset kuvankaappaukset ja videot valitsemalla *Actions*-välilehdellä epäonnistuneen testiajon. Kuvat ja videot löytyvät kohdasta *Artifacts* nimillä *cypress-screenshots* ja *cypress-videos*.
