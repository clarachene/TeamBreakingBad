const express = require('express')
const app = express()
const port = 3000

//OS est un utilitaire node qui va nous servir à afficher le nom de notre raspberry
const os = require("os");
//MustacheExpress est notre moteur de template
const mustacheExpress = require('mustache-express');

//Configuration du moteur de template
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');

//Ici on dit au serveur de servir les fichiers statiques depuis le dossier /public
app.use(express.static('public'))

app.get('/', (request, response) => {
  //Ici on indique que nous voulons transformer notre fichier index.mustache en HTML
  response.render('index');
})

app.get('/hello/:name', (request, response) => {
  //De la même manière nous transformons notre fichier hello.mustache en HTML en passant des paramètres.
  response.render('hello', {name: request.params.name});
})

app.get('/on', (request, response) => {
  const Gpio = require('onoff').Gpio;
  const sleep = require('sleep');
  //Création d'une variable qui va nous permettre d'accéder à un GPIO du raspberry  
  //⚠️ Le nombre passé en paramètre correspond au numéro de GPIO et non au numéro de la pin.
  const led = new Gpio(17, 'out');
  const led2 = new Gpio(26, 'out');

  console.log('Led On');
  //On indique à la pin GPIO 4 que l'on veut envoyer du courant sur celle-ci
  led.writeSync(1);
  led2.writeSync(1);

  response.render('on', {name: request.params.name});
})

app.get('/off', (request, response) => {
  const Gpio = require('onoff').Gpio;
  const sleep = require('sleep');

  const led = new Gpio(17, 'out');
  const led2 = new Gpio(26, 'out');
  led.writeSync(0);
  led2.writeSync(0);
  console.log('Led Off');

  //On indique qu'on a fini d'utiliser la pin GPIO 4.
  led.unexport();

  response.render('off', {name: request.params.name});
})

app.listen(port, (err) => {
  if (err) {
    return console.log('Erreur du serveur : ', err)
  }

  //On utilise l'utilitaire OS pour récupérer le nom de notre raspberry.
  console.log('Le serveur écoute sur le port '+port+'\nRendez vous sur http://'+os.hostname()+'.local:'+port);
})
