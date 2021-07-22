const multer = require('multer');

// function pour création du nom de l'image et stockage vers le serveur 
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_'); //remplace les espaces par des underscores
    callback(null,Date.now() + name);
  }
});

module.exports = multer({storage}).single('image');