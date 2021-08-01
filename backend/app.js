//importation des plugins
const express = require('express');
const bodyParser = require('body-parser');
const mongoSanitize = require('express-mongo-sanitize');
const mongoose = require('mongoose');
const path = require('path');

//importation des fichiers routes
const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');

// mise en place de la fonction express()
const app = express();

// adresse de connexion pour la bdd MongoDB
mongoose.connect('mongodb+srv://user:v7E3JthKEdU4bbzR@clustertest.4jtzg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
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
app.use(bodyParser.json());

// supprime les clé json $
app.use(mongoSanitize());


// declaration des routes de l'api
app.use('/images', express.static(path.join(__dirname, 'images'))); //dossier static pour ajout image
app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);

module.exports = app;