//plugin token connexion
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]; //recuperation du token
    const decodedToken = jwt.verify(token, 'un_probleme_sans_solution_est_un_probleme_mal_pose'); // decodage du token grace a la clé 
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) { //verification du token
      throw 'Invalid user ID';
    } else {
      next(); // passe au middleware suivant
    }
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};