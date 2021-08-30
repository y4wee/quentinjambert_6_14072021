// plugins neccessaires
const express = require('express');
const router = express.Router();

// utilisé pour empêcher les adresses IP de faire des demandes répétées aux points de terminaison de l'API
const rateLimit = require('express-rate-limit');

// importation controller
const userCtrl = require('../controllers/user');

// rateLimit pour les connexions
const connexionLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 5, // bloque apres 5 requetes
    skipSuccessfulRequests: true,
  });

//declare les routes possible vers /api/auth
router.post('/signup', userCtrl.signup);
router.post('/login',connexionLimiter, userCtrl.login);

module.exports = router;