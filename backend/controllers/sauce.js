const Sauce = require('../models/sauce');
const fs = require('fs');

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
  });
  sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce enregistrée !'}))
    .catch(error => res.status(400).json({ error }));
};

exports.modifySauce = (req, res, next) => {
  let sauceObject
  if (req.file) {
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, (err) => {
          if (err) throw err;
        });
      })
      .catch(error => res.status(500).json({ error }));
    sauceObject = {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    }
  } else {
    sauceObject = { ...req.body };
  }
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'sauce modifiée !'}))
    .catch(error => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => res.status(200).json(sauce))
      .catch(error => res.status(404).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
      .then(sauces => res.status(200).json(sauces))
      .catch(error => res.status(400).json({ error }));
};

exports.deleteOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

exports.likeSauce = (req, res, next) => {
  const like = req.body.like;
  const user = req.body.userId;
  const sauceId = req.params.id;
  
  if (like == 1) {
    Sauce.updateMany(
      { _id: sauceId },
      { $inc: {likes: 1}, $push: {usersLiked: user} }
    )
    .then(() => res.status(200).json({ message: "ajouté un like"}))
    .catch(error => res.status(400).json({ error: error }));
  }
  else if (like == -1) {
    Sauce.updateMany(
      { _id: sauceId },
      { $inc: {dislikes: 1}, $push: {usersDisliked: user} }
    )
    .then(() => res.status(200).json({ message: "ajouté un dislike"}))
    .catch(error => res.status(400).json({ error: error }));
  } else {
    Sauce.findOne({ _id: sauceId })
      .then((sauce) => {
        if (sauce.usersLiked.find(user => user = req.body.userId)) {
          Sauce.updateMany(
            { _id: sauceId },
            { $inc: {likes: -1}, $pull: {usersLiked: user} }
          )
          .then(() => res.status(200).json({ message: "enlevé un like"}))
          .catch(error => res.status(400).json({ error: error }));
        } else {
          Sauce.updateMany(
            { _id: sauceId },
            { $inc: {dislikes: -1}, $pull: {usersDisliked: user} }
          )
          .then(() => res.status(200).json({ message: "enlevé un dislike"}))
          .catch(error => res.status(400).json({ error: error }));
        }
      })
      .catch(error => res.status(404).json({ error: error }));
  }
}
