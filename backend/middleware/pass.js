// recuperation shema de validation du pass
const passSchema = require("../models/pass");

// logique du modele utiliser pour valider le mot de passe

module.exports = (req, res, next) => {
  if (!passSchema.validate(req.body.password)) {
    return res.status(400).json({
      error:
        "mot de passe incorect, majuscule, minuscule et au moins un chiffre"
    });
  } else {
    next();
  }
};