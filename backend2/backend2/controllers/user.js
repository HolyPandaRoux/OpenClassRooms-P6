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
//.is().not().oneOf(['Passw0rd', 'Password123']); 
// this list of forbidden passwords is not necessary because the password is hashed
// however it is a good practice to add it , the password list will need to be researched and updated regularly



exports.signup = (req, res, next) => {
    console.log(req.body.password);
    if(!schema.validate(req.body.password)) {
    console.log('niveau 2')
        throw {error:'le mot de passe doit contenir au moins 8 caractères dont 1chiffre, 1 lettre majuscule et 1 minuscule'}
    }else {
        console.log('niveau 3')
        bcrypt.hash(req.body.password, 10) 
            .then(async (hash) => {
                const user = new User({ 
                    email: maskData.maskEmail2(req.body.email),
                    password: hash
                });
                console.log('niveau 4')
                await user.save(user);
                console.log('niveau 5')
                try {                
                    await user.save(user);
                    console.log('niveau 6')
                    res.status(201).json ({message: 'Utilisateur créé !'})
                } catch (error) {
                    console.log('niveau 7')
                    res.status(400).json({ error });
                
                }
                    

            })
            .catch(error => console.log ('ceci est une erreur', error));
        }
};


exports.login = (req, res, next) => {
    User.findOne({ email: maskData.maskEmail2(req.body.email)}) 
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: "Il n y a pas d'utilisateur avec ce mail!" });
            }

            const regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]{2,}\.[a-zA-Z]{2,4}$/;
            if (!regexEmail.test(req.body.email)) {
                res.status(401).json({ error: "Rentrez un mail valide" })
                return false
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
};

