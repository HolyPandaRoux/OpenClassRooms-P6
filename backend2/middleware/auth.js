
const express = require('express');
const dotenv = require('dotenv').config();
const jsonwebtoken = require('jsonwebtoken');
const router = express.Router();

module.exports = (req, res, next) => {
    try {   
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken =jsonwebtoken.verify(token, env.token);
        const userId = decodedToken.userId;
    
        if (req.body.userId && req.body.userId !== userId) {  //on verifie userId avec celui de la requete
          throw "Idendifiant invalide";
        } else {
          next();
        }
    } catch {
        res.status(401).json(new Error('requête refusée')
      );
    }
};


module.exports = router