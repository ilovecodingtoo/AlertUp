## Avvio rapido del progetto

1. Creare un file `.sh`, ad esempio `deploy.sh`:


__#bash__
    nano deploy.sh


**Incollare all'interno tutto lo script:**

mkdir -p ~/SDH
cd ~/SDH

docker run -d --name mongodb -p 27017:27017 mongo

git init
git clone https://github.com/ilovecodingtoo/AlertUp
cd AlertUp

(
  cd backend || exit 1
  npm install
  npm install nodemon --save-dev
  npm run build
  npm run start
) &   

cd frontend || exit 1
npm install
npm run build 
npx cap sync
npx cap open android &   
sleep 60  
adb reverse tcp:3000 tcp:3000


**Rendere il file eseguibile:**
        chmod 777 deploy.sh


**Eseguire lo script:**
        ./deploy.sh









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
