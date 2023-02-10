const User = require('../models/User');
const bcrypt = require('bcrypt'); 
const jsonwebtoken = require('jsonwebtoken'); 
const maskData = require('maskdata'); 
const passwordValidator = require('password-validator');

let schema = new passwordValidator();
schema
  .is().min(8) 
  .is().max(20) 
  .has().uppercase() 
  .has().lowercase() 
  .has().digits(1) 
  .has().not().spaces()     

module.exports.validatePassword = (password) => {
  return schema.validate(password);
};

exports.signup = (req, res, next) => {
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({ error: 'Renseignez votre adresse mail et votre mot de passe' });
    }

    if (!validatePassword(req.body.password)) {
        return res.status(400).json({ error: 'Le mot de passe doit contenir 8 caractères, inclure une majuscule et un chiffre' });
    }

    bcrypt .hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: maskData.maskEmail2(req.body.email),
                password: hash
            });
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
},


exports.login = (req, res, next) => {
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({ error: 'Renseignez votre adresse mail et votre mot de passe' });
    }

    User.findOne({ email: maskData.maskEmail2(req.body.email)}) 
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: "Il n'y a pas d'utilisateur avec ce mail!" });
            }
            bcrypt.compare(req.body.password, user.password) 
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jsonwebtoken.sign( 
                            { userId: user._id }, 
                            `${process.env.TOP_SECRET}`,  
                            { expiresIn: '24h' }  
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
}