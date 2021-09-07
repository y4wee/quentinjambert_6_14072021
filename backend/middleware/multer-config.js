const multer = require('multer');

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
  "video/mp4": "mp4",
};
// function pour création du nom de l'image et stockage vers le serveur 
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_'); //remplace les espaces par des underscores 
    const extension = MIME_TYPES[file.mimetype];
    callback(null,Date.now() + name + "." + extension);
  }
});

module.exports = multer({storage}).single('image');