// plugins neccessaires
const express = require('express');
const router = express.Router();

// importation des middleware
const auth = require('../middleware/auth'); //gestion des autorisations
const multer = require('../middleware/multer-config'); //gestion des fichiers images

// importation controller
const sauceCtrl = require('../controllers/sauce');

//declare les routes possible vers /api/sauces
router.post('/', auth, multer, sauceCtrl.createSauce);

router.put('/:id', auth, multer, sauceCtrl.modifySauce);

router.get('/:id', auth, sauceCtrl.getOneSauce);

router.get('/', auth, sauceCtrl.getAllSauces);

router.delete('/:id', auth, sauceCtrl.deleteOneSauce);

router.post('/:id/like', auth, sauceCtrl.likeSauce);

module.exports = router;