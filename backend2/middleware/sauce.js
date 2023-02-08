/* 
This code exports functions for managing sauces in a database. The functions are:

createSauce: Creates a new sauce by parsing the request body and storing the information in a new Sauce model instance.

modifySauce: Updates an existing sauce based on the request body and the sauce's ID. If a file is attached to the request, the old image will be deleted and the new image's path will be stored in the database.

deleteSauce: Deletes a sauce by its ID. The corresponding image is also deleted.

getOneSauce: Retrieves a single sauce by its ID.

getAllSauces: Retrieves all sauces in the database.

likeSauce: Allows a user to like or dislike a sauce, or to change their vote. The user's ID and the vote (1 for like, -1 for dislike, 0 for removing the vote) are passed in the request body.

*/



const Sauce = require('../models/Sauce');
const firesystem = require('fs');

exports.createSauce  = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce); 
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject, 
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    });
    sauce.save()
        .then(() => { res.status(201).json({ message: 'sauce créee!' }) })
        .catch((error) => { res.status(400).json({ error: error }) });
};

exports.modifySauce  = (req, res, next) => {
    if(req.file) {
        Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            firesystem.unlink(`images/${filename}`, (error => {
                if(error) 
                    {console.log(error)}
                else {
                    console.log("image effacée");
                }
            })) 
        })
    };
    const sauceObject = req.file ?
        {   
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, id: req.params.id }) 
        .then(() => res.status(200).json({ message: 'sauce modifiée !' }))
        .catch(error => res.status(400).json({ error }));
};

exports.deleteSauce  = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id }) 
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            firesystem.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
};

exports.getOneSauce  = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};

exports.getAllSauces = (req, res, next) => {  
    Sauce.find()
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(400).json({ error }));
};

exports.likeSauce    = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id }) 
        .then(sauce => {
            switch (req.body.like) {
                case 1: 
                    sauce.likes += 1;
                    sauce.usersLiked.push(req.body.userId);
                    break;
                case -1:
                    sauce.dislikes += 1;
                    sauce.usersDisliked.push(req.body.userId);
                    break;
                case 0: 
                    if (sauce.usersLiked.some(userId => userId == req.body.userId)) {
                        sauce.likes -= 1;
                        sauce.usersLiked = sauce.usersLiked.filter(userId => userId != req.body.userId); 
                    } else { 
                        sauce.dislikes -= 1;
                        sauce.usersDisliked = sauce.usersDisliked.filter(userId => userId != req.body.userId);
                    }
                    break;
                default: 
                    console.log('erreur dans les likes/dislikes');
            }
            sauce.save() 
                .then(() => res.status(200).json())
                .catch(error => res.status(400).json({ error }));
        })
}

