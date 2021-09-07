// plugins neccessaires
const express = require('express');
const router = express.Router();

// import des middleware pour validation email et mdp
const emailValide = require("../middleware/email");
const validationPass = require("../middleware/pass");

// importation controller
const userCtrl = require('../controllers/user');

// utilisé pour empêcher les adresses IP de faire des demandes répétées aux points de terminaison de l'API
const rateLimit = require('express-rate-limit');

// rateLimit pour les connexions
const connexionLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 5, // bloque apres 5 requetes
    skipSuccessfulRequests: true,
  });

//declare les routes possible vers /api/auth
router.post('/signup',emailValide, validationPass, userCtrl.signup);
router.post('/login', connexionLimiter, userCtrl.login);

module.exports = router;