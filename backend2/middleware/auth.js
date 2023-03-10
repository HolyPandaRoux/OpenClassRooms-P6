//securité pour verifier le TOKEN
const jsonwebtoken = require('jsonwebtoken');
/* A module that allows you to use environment variables in your application. */
const dotenv = require('dotenv');

/* checks if the user is authenticated. */
dotenv.config();
module.exports = (req, res, next) => {
    try {   
        const token = req.headers.authorization.split(' ')[1]; //on trouve le numero du token par son emplacement 
        const decodedToken = jsonwebtoken.verify(token, `${process.env.TOP_SECRET}`);
        const userId = decodedToken.userId;//on en fait un objet JS pour récupérer l'Id qui est dedans
    
        if (req.body.userId && req.body.userId !== userId) {  //on verifie userId avec celui de la requete
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