const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    //Récupération du 2ème élèment du tableau
    const token = req.headers.authorization.split(' ')[1];
    //Vérification du token et de la clé secrète
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    //On récupère l'Id du User
    const idUser = decodedToken.userId;
    //Vérification si l'id du corps de la requête est égale à l'Id du User pour permettre l'authentification
    if (req.body.id && req.body.id !== idUser) {
      throw 'Invalid user ID';
    } else {
      next();
    }
  } catch {
    res.status(401).json({ error: "Vous n'êtes pas authentifié, authentifié vous." });
  }
};