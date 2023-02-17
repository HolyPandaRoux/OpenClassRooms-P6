const Sauce = require('../models/Sauce');
const fs    = require('fs');

exports.createSauce  = async (req, res, next) => {
    try {
        const sauceObject = JSON.parse(req.body.sauce);
        delete sauceObject._id;
        const sauce = new Sauce({
            ...sauceObject,
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        });
        await sauce.save();
        res.status(201).json({ message: 'Sauce créée!' });
    } catch (error) {
        res.status(400).json({ error });
    }
};

exports.modifySauce  = async (req, res, next) => {
    try {
        const sauce = await Sauce.findOne({ _id: req.params.id });
        if (req.file) {
            deleteImage(sauce.imageUrl);
        }
        const sauceObject = req.file
            ? {
                ...JSON.parse(req.body.sauce),
                imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
            }
            : { ...req.body };
        await Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, id: req.params.id });
        res.status(200).json({ message: 'Sauce modifiée!' });
    } catch (error) {
        res.status(400).json({ error });
    }
};

exports.deleteSauce  = async (req, res, next) => {
    try {
        const sauce = await Sauce.findOne({ _id: req.params.id });
        deleteImage(sauce.imageUrl);
        await Sauce.deleteOne({ _id: req.params.id });
        res.status(200).json({ message: 'Sauce supprimée!' });
    } catch (error) {
        res.status(500).json({ error });
    }
};

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
        const sauces = await Sauce.find();
        res.status(200).json(sauces);
    } catch (error) {
        res.status(400).json({ error });
    }
};

exports.likeSauce    = async (req, res, next) => {
    try {
        const sauce = await Sauce.findById(req.params.id);
        if (!sauce) {
            return res.status(404).json({ error: 'Sauce not found' });
        }

        const userId = req.body.userId;
        const like = req.body.like;

        // User already liked the sauce
        if (sauce.usersLiked.includes(userId)) {
            if (like === 1) {
                return res.status(400).json({ error: 'User already liked the sauce' });
            }
            sauce.likes -= 1;
            sauce.usersLiked = sauce.usersLiked.filter((id) => id !== userId);
        }

        // User already disliked the sauce
        if (sauce.usersDisliked.includes(userId)) {
            if (like === -1) {
                return res.status(400).json({ error: 'User already disliked the sauce' });
            }
            sauce.dislikes -= 1;
            sauce.usersDisliked = sauce.usersDisliked.filter((id) => id !== userId);
        }

        // User liked the sauce
        if (like === 1) {
            sauce.likes += 1;
            sauce.usersLiked.push(userId);
        }

        // User disliked the sauce
        if (like === -1) {
            sauce.dislikes += 1;
            sauce.usersDisliked.push(userId);
        }

        await sauce.save();
        res.status(200).json(sauce);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
