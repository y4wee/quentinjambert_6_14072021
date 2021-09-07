  // module pour la validation email
const emailValide = require("validator");

// logique validation email

module.exports = (req, res, next) => {
  if (!emailValide.isEmail(req.body.email)) {
    return res.status(400).json({
      error: "email non valide",
    });
  } else {
    next();
  }
};