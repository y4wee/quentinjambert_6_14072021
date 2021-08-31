const passValidator = require("password-validator");

const passSchema = new passValidator();

// declaration du shema du mot de passe

passSchema
  .is().min(8)
  .is().max(100)
  .has().uppercase()
  .has().lowercase()
  .has().digits(1)
  .has().not().spaces()
  .is().not().oneOf(["Passw0rd", "Password123"]);

// exportation du shema

module.exports = passSchema;