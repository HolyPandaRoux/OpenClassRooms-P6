//securité pour verifier le TOKEN
const jsonwebtoken = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {   
        const token = req.headers.authorization.split(' ')[1]; 
        const decodedToken = jsonwebtoken.verify(token, `${process.env.TOP_SECRET}`);
        const userId = decodedToken.userId;
        if (req.body.userId && req.body.userId !== userId) { 
          throw "Identitée de l'utilisateur non enregistrée";
        } else {
          next();
        }
    } catch {
        res.status(401).json({
            error: new Error('requête non authentifiée!')
        });
    }
};