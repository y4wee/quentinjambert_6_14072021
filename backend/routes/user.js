// plugins neccessaires
const express = require('express');
const router = express.Router();

// importation controller
const userCtrl = require('../controllers/user');

//declare les routes possible vers /api/auth
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;