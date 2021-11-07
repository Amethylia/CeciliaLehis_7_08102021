const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const idUser = decodedToken.userId;
    if (req.params.id && req.params.id !== idUser) {
      throw 'Invalid user ID';
    } else {
        res.UserId = decodedToken.userId;
      next();
    }
  } catch {
    res.status(401).json({ error: "Vous n'êtes pas authentifié, authentifié vous." });
  }
};