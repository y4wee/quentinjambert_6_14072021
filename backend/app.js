"use strict";
//importation des plugins
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require("dotenv");
const path = require('path');

const toobusy = require('toobusy-js');

const helmet = require("helmet");
const mongoSanitize = require('express-mongo-sanitize');
const xssClean = require('xss-clean');
const hpp = require('hpp');

//importation des fichiers routes
const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');

// mise en place de la fonction express()
const app = express();
dotenv.config();


// adresse de connexion pour la bdd MongoDB
mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@clustertest.4jtzg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// mise en place CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// parser automatiquement le coprs de la reponse
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// éviter les attaques de pollution des paramètres HTTP
app.use(hpp());
// supprime certaines clé et characters, protege contre les injexion, attaque XSS
app.use(mongoSanitize());
// définit des en-têtes de réponse HTTP liés à la sécurité pour se protéger contre certaines vulnérabilités Web bien connues
app.use(helmet());
// nettoie les entrées utilisateur provenant du corps de la requête POST ( req.body), de requête GET ( req.query) et des paramètres d'URL ( req.params).
app.use(xssClean());


// surveiller la boucle d'événement, si le trafic reseau est trop important
app.use(function(req, res, next) {
  if (toobusy()) {
      // log if you see necessary
      res.send(503, "Server Too Busy");
  } else {
  next();
  }
});

// declaration des routes de l'api
app.use('/images', express.static(path.join(__dirname, 'images'))); //dossier static pour ajout image
app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);

module.exports = app;