//plugins
const Sauce = require('../models/sauce');
const fs = require('fs');

//controlleur pour la creation d'une nouvelle sauce
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce); //recuperation corps de la requete parsé pour l'image
  delete sauceObject._id; // suppression de l'id généré automatiquement
  const sauce = new Sauce({ // creation du nouvel objet sauce grace au model pré-établie
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`, //creation URL image
  });
  sauce.save() // sauvegarde dans la bdd
    .then(() => res.status(201).json({ message: 'Sauce enregistrée !'}))
    .catch(error => res.status(400).json({ error }));
};

//controlleur pour modifier une sauce existante
exports.modifySauce = (req, res, next) => {
  let sauceObject // creation d'une variable pour l'objet modifié
  if (req.file) { // si il ya une modification de l'image
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, (err) => { //suppression de l'ancienne image de la bdd
          if (err) throw err;
        });
      })
      .catch(error => res.status(500).json({ error }));
    sauceObject = { // nouvel objet modifié avec la nouvelle image
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    }
  } else { //si aucun changement image juste changer avec le corps de la requete directement en json
    sauceObject = { ...req.body };
  }
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })// applique les modification dans la bdd avec le nouvel objet modifié
    .then(() => res.status(200).json({ message: 'sauce modifiée !'}))
    .catch(error => res.status(400).json({ error }));
};

//controlleur qui renvoi une sauce en fonction de son id
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => res.status(200).json(sauce))
      .catch(error => res.status(404).json({ error }));
};

// controlleur qui renvoi toutes les sauces de la bdd
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
      .then(sauces => res.status(200).json(sauces))
      .catch(error => res.status(400).json({ error }));
};

// controlleur qui supprime une sauce de la bdd
exports.deleteOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }) //trouve la sauce en question dans la bdd par son id
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => { // supprime l'image de la bdd
        Sauce.deleteOne({ _id: req.params.id }) // supprime l'objet sauce trouvé
          .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

//controlleur pour la gestion des like/dislike des sauces
exports.likeSauce = (req, res, next) => {
  const like = req.body.like;
  const user = req.body.userId;
  const sauceId = req.params.id;
  
  if (like == 1) { // si like
    Sauce.updateMany( //mets a jour la sauce en question par son id 
      { _id: sauceId },
      { $inc: {likes: 1}, $push: {usersLiked: user} } // change le nombre de like et mets le userId dans les tableau des liked
    )
    .then(() => res.status(200).json({ message: "ajouté un like"}))
    .catch(error => res.status(400).json({ error: error }));
  }
  else if (like == -1) { // si dislike
    Sauce.updateMany( //mets a jour la sauce en question par son id 
      { _id: sauceId },
      { $inc: {dislikes: 1}, $push: {usersDisliked: user} } // change le nombre de dislike et mets le userId dans les tableau des disliked
    )
    .then(() => res.status(200).json({ message: "ajouté un dislike"}))
    .catch(error => res.status(400).json({ error: error }));
  } else { // si on veut enlever un like ou un dislike
    Sauce.findOne({ _id: sauceId }) // on cherche la sauce en question par son id
      .then((sauce) => {
        if (sauce.usersLiked.find(user => user = req.body.userId)) { // on verifie si le userId est present dans le tableau des liked
          Sauce.updateMany(
            { _id: sauceId },
            { $inc: {likes: -1}, $pull: {usersLiked: user} } // si oui on enleve un like et le userId du tableau des liked
          )
          .then(() => res.status(200).json({ message: "enlevé un like"}))
          .catch(error => res.status(400).json({ error: error }));
        } else { // sinon  le user doit etre dans les disliked
          Sauce.updateMany(
            { _id: sauceId },
            { $inc: {dislikes: -1}, $pull: {usersDisliked: user} } // on enleve un dislike et le userId du tableau des disliked
          )
          .then(() => res.status(200).json({ message: "enlevé un dislike"}))
          .catch(error => res.status(400).json({ error: error }));
        }
      })
      .catch(error => res.status(404).json({ error: error }));
  }
}
