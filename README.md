## Stato di avanzamento del progetto

Lo sviluppo dell’applicazione è in fase avanzata.  
Attualmente risultano implementate tutte le funzionalità core previste dal Documento dei Requisiti:

- Registrazione e autenticazione utenti
- Gestione del profilo
- Visualizzazione delle emergenze tramite mappa
- Creazione e consultazione del dettaglio emergenza
- Sistema di notifiche
- Integrazione meteo e collegamenti a servizi esterni

Le attività ancora in corso riguardano principalmente:

- Test funzionali e di integrazione
- Verifica dei requisiti non funzionali
- Rifiniture minori dell’interfaccia utente

Il codice è stabile e l’applicazione risulta utilizzabile in tutte le sue parti principali.

---

# controllare se MongoDB server sta runnando
sc query MongoDB

# build backend
tsc index.ts

# start backend
node index

# build frontend
ng build

# aggiorna capacitor
npx cap sync

# apri Android Studio
npx cap open android


## Avvio rapido del progetto

Apri il terminale e digita:

```bash
$ mkdir -p ~/SDH
$ cd ~/SDH

$ docker run -d --name mongodb -p 27017:27017 mongo

$ git clone https://github.com/ilovecodingtoo/AlertUp
$ cd AlertUp

$ ( cd backend || exit 1
$   npm install
$   npm install nodemon --save-dev
$   npm run build
$   npm run start
$ ) &

$ ( cd frontend || exit 1
$   npm install
$   npm run build
$   npx cap sync
$   npx cap open android
$ ) &

$ sleep 60
$ adb reverse tcp:3000 tcp:3000

$ chmod +x deploy.sh
$ ./deploy.sh

