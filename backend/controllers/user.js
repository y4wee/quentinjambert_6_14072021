// plugins
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// controlleur d'inscription utilisateur
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10) // cryptage du mdp
      .then(hash => {
        const user = new User({
          email: req.body.email,
          password: hash
        });
        user.save() // sauvegarde les informations utilisateur
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
};

// controlleur de connexion des utilisateurs
exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email }) //verifie si l'email est valide
    .then(user => {
      if (!user) {
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      }
      bcrypt.compare(req.body.password, user.password) // verifie si le mdp est valide
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign(
              { userId: user._id },
              'un_probleme_sans_solution_est_un_probleme_mal_pose', // creation token de connexion
              { expiresIn: '24h' }
            )
          });
        })
        .catch(error => res.status(501).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};