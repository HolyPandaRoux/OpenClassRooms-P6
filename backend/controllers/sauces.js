/* This is importing the Sauce model and the fs module. */
const Sauce = require("../models/Sauce");
const fs = require("fs");


/* This is a function that is used to create a sauce in the database. */
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        likes: 0,
        dislikes: 0,
        usersDisliked: [],
        usersLiked: [],
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename
            }`,
    });
    sauce
        .save()
        .then(() => res.status(201).json({ message: "Sauce enregistré !" }))
        .catch((error) => res.status(400).json({ error }));
};

/* The above code is a function that is used to get one sauce from the database. */
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({
        _id: req.params.id,
    })
        .then((sauce) => {
            res.status(200).json(sauce);
        })
        .catch((error) => {
            res.status(404).json({
                error: error,
            });
        });
};

/* This is a function that is used to modify a sauce in the database. */
exports.modifySauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id }).then((sauce) => {
        const filename = sauce.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
            const sauceObject = req.file
                ? {
                    ...JSON.parse(req.body.sauce),
                    imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename
                        }`,
                }
                : { ...req.body };
            Sauce.updateOne(
                { _id: req.params.id },
                { ...sauceObject, _id: req.params.id }
            )
                .then(() => res.status(200).json({ message: "Sauce modifiée !" }))
                .catch((error) => res.status(400).json({ error }));
        });
    });
};

/* This is a function that is used to delete a sauce from the database. */
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            const filename = sauce.imageUrl.split("/images/")[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: "Sauce supprimé !" }))
                    .catch((error) => res.status(400).json({ error }));
            });
        })
        .catch((error) => res.status(500).json({ error }));
};

/* This is a function that is used to get all the sauces from the database. */
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then((sauces) => {
            res.status(200).json(sauces);
        })
        .catch((error) => {
            res.status(400).json({
                error: error,
            });
        });
};

/* This is a function that is used to like a sauce in the database. */
exports.likeSauce = (req, res, next) => {
    const sauceId = req.params.id;
    const userId = req.body.userId;
    const like = req.body.like;

    if (like === 1) {
        Sauce.updateOne(
            { _id: sauceId },
            {
                $inc: { likes: like },
                $push: { usersLiked: userId },
            }
        )
            .then((sauce) => res.status(200).json({ message: "Sauce appréciée" }))
            .catch((error) => res.status(500).json({ error }));
    }

 
/* This is a function that is used to like a sauce in the database. */
    else if (like === -1) {
        Sauce.updateOne(
            { _id: sauceId },
            {
                $inc: { dislikes: -1 * like },
                $push: { usersDisliked: userId },
            }
        )
            .then((sauce) => res.status(200).json({ message: "Sauce dépréciée" }))
            .catch((error) => res.status(500).json({ error }));
    }

    /* This is a function that is used to like a sauce in the database. */
    else {
        Sauce.findOne({ _id: sauceId })
            .then((sauce) => {
                if (sauce.usersLiked.includes(userId)) {
                    Sauce.updateOne(
                        { _id: sauceId },
                        { $pull: { usersLiked: userId }, $inc: { likes: -1 } }
                    )
                        .then((sauce) => {
                            res.status(200).json({ message: "Sauce dépréciée" });
                        })
                        .catch((error) => res.status(500).json({ error }));
                } 
                else if (sauce.usersDisliked.includes(userId)) {
                    Sauce.updateOne(
                        { _id: sauceId },
                        {
                            $pull: { usersDisliked: userId },
                            $inc: { dislikes: -1 },
                        }
                    )
                        .then((sauce) => {
                            res.status(200).json({ message: "Sauce appréciée" });
                        })
                        .catch((error) => res.status(500).json({ error }));
                }
            })
            .catch((error) => res.status(401).json({ error }));
    }
};