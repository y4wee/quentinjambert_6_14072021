const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const sauceCtrl = require('../controllers/sauce');

router.post('/', multer, sauceCtrl.createSauce);

router.put('/:id', multer, sauceCtrl.modifySauce);

router.get('/:id', sauceCtrl.getOneSauce);

router.get('/', sauceCtrl.getAllSauces);

router.delete('/:id', sauceCtrl.deleteOneSauce);

router.post('/:id/like', sauceCtrl.likeSauce);

module.exports = router;