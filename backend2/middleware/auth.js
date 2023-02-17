const jsonwebtoken = require('jsonwebtoken');

const auth = (req, res, next) => {
  if (!req.headers.authorization || typeof req.headers.authorization !== 'string') {
    return res.status(401).json({ error: 'Unauthorized request' });
  }

  let userId;
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jsonwebtoken.verify(token, process.env.token);
    userId = decodedToken.userId;
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized request' });
  }

  if (req.body.userId && req.body.userId !== userId) {
    return res.status(401).json({ error: 'Invalid User ID' });
  }

  next();
};

module.exports = auth; 