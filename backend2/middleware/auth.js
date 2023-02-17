const jsonwebtoken = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    if (!req.headers.authorization || typeof req.headers.authorization !== 'string') {
      return res.status(401).json({ error: 'Unauthorized request' });
    }

    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jsonwebtoken.verify(token, process.env.token);
    const userId = decodedToken.userId;

    if (req.body.userId && req.body.userId !== userId) {
      throw new Error('Invalid User ID');
    } else {
      next();
    }
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized request' });
  }
};

module.exports = auth;