//plugin necessaire
const mongoose = require('mongoose');

//model de sauce enregistré dans la bdd mongoDB
const sauceSchema = mongoose.Schema({
  userId: { type: String, required: true },  //id createur de la sauce
  name: { type: String, required: true },  //nom de sauce
  manufacturer: { type: String, required: true },  //createur de la sauce
  description: { type: String, required: true },  //description
  mainPepper: { type: String, required: true },  //ingredient principale
  imageUrl: { type: String, required: true },  //URL image
  heat: { type: Number, required: true },  //puissance de la sauce
  likes: { type: Number, required: true, default: 0 },  //nombre de like
  dislikes: { type: Number, required: true, default: 0 },  //nombre de dislike
  usersLiked: { type: Array, required: true, default: [] },  //tableau des userId qui aiment la sauce
  usersDisliked: { type: Array, required: true, default: [] }, //tableau des userId qui n'aiment pas la sauce
});

module.exports = mongoose.model('Sauce', sauceSchema);