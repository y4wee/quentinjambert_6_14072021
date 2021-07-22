//plugins necessaires
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');//verifier si la chaine de char est unique

//modele de parametre utilisateur sauvegardé dans la bdd mongoDB
const userSchema = mongoose.Schema({
    email: { type: String, unique: true, required: true }, // email verifié si unique
    password: { type: String, required: true } //password
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);