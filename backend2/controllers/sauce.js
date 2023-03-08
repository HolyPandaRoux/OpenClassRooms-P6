const Sauce = require('../models/Sauce');
const fs    = require('fs');
const path  = require('path');

exports.getOneSauce  = async (req, res, next) => {
    try {
        const sauce = await Sauce.findOne({ _id: req.params.id });
        res.status(200).json(sauce);
    } catch (error) {
        res.status(404).json({ error });
    }
};

exports.getAllSauces = async (req, res, next) => {
    try {
        const sauce = await Sauce.find();
        res.status(200).json(sauce);
    } catch (error) {
        res.status(400).json({ error });
    }
};

exports.createSauce  = async (req, res, next) => {
    try {
        const sauceObject = JSON.parse(req.body.sauce);
        delete sauceObject._id;
        const sauce = new Sauce({
            ...sauceObject,
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        });
        await sauce.save();
        console.log('Sauce created!');
        res.status(201).json({ message: 'Sauce created!' });
    } catch (error) {
        console.log(error);
        res.status(400).json({ error });
    }
};

exports.modifySauce  = async (req, res, next) => {
    try {
        const sauce = await Sauce.findOne({ _id: req.params.id });
        if (req.file && sauce.imageUrl) {
            const imagePath = path.join(__dirname, '..', 'images', sauce.imageUrl.split('/images/')[1]);
            fs.unlink(imagePath, (error) => {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Image deleted');
                }
            });
        }
        console.log(req.file)
        const sauceObject = req.file
            ? {
                ...JSON.parse(req.body.sauce),
                imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
            }
            : { ...req.body };
        console.log(sauceObject)
        await Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id });
        res.status(200).json({ message: 'Sauce modified!' });
    } catch (error) {
        res.status(400).json({ error });
    }
};

exports.deleteSauce  = async (req, res, next) => {
    try {
        const sauce = await Sauce.findOne({ _id: req.params.id });
        if (sauce.imageUrl) {
            const imagePath = path.join('images', sauce.imageUrl.split('/images/')[1]);
            if (fs.existsSync(imagePath)) {
                fs.unlink(imagePath, () => {
                    Sauce.deleteOne({ _id: req.params.id })
                        .then(() => {
                            res.status(200).json({ message: 'Object deleted!' });
                        })
                        .catch((error) => {
                            res.status(400).json({ error });
                        });
                });
            } else {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => {
                        res.status(200).json({ message: 'Object deleted!' });
                    })
                    .catch((error) => {
                        res.status(400).json({ error });
                    });
            }
        } else {
            Sauce.deleteOne({ _id: req.params.id })
                .then(() => {
                    res.status(200).json({ message: 'Object deleted!' });
                })
                .catch((error) => {
                    res.status(400).json({ error });
                });
        }
    } catch (error) {
        res.status(400).json({ error });
    }
};

exports.likeSauce    = async (req, res, next) => {
            try {
                const sauce = await Sauce.findOne({ _id: req.params.id });
                const like = req.body.like;
                const userId = req.body.userId;
                if (like === 1) {
                    if (!sauce.usersLiked.includes(userId)) {
                        sauce.usersLiked.push(userId);
                        sauce.likes++;
                    }
                } else if (like === -1) {
                    if (!sauce.usersDisliked.includes(userId)) {
                        sauce.usersDisliked.push(userId);
                        sauce.dislikes++;
                    }
                } else if (like === 0) {
                    if (sauce.usersLiked.includes(userId)) {
                        sauce.usersLiked.splice(sauce.usersLiked.indexOf(userId), 1);
                        sauce.likes--;
                    } else if (sauce.usersDisliked.includes(userId)) {
                        sauce.usersDisliked.splice(sauce.usersDisliked.indexOf(userId), 1);
                        sauce.dislikes--;
                    }
                }
                await sauce.save();
                res.status(200).json({ message: 'Sauce liked!' });
            } catch (error) {
                res.status(400).json({ error });
            }
}