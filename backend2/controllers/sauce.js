const Sauce = require('../models/Sauce');
const fs = require('fs');

exports.getOneSauce = async (req, res, next) => {
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

exports.createSauce = async (req, res, next) => {
    try {
        const sauceObject = JSON.parse(req.body.sauce);
        delete sauceObject._id;
        const sauce = new Sauce({
            ...sauceObject,
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        });
        await sauce.save();
        res.status(201).json({ message: 'Sauce created!' });
    } catch (error) {
        res.status(400).json({ error });
    }
};

exports.modifySauce = async (req, res, next) => {
    try {
        if (req.file) {
            const sauce = await Sauce.findOne({ _id: req.params.id });
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, (error) => {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Image deleted');
                }
            });
        }
        const sauceObject = req.file
            ? {
                ...JSON.parse(req.body.sauce),
                imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
            }
            : { ...req.body };
        await Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id });
        res.status(200).json({ message: 'Sauce modified!' });
    } catch (error) {
        res.status(400).json({ error });
    }
};

exports.deleteSauce = async (req, res, next) => {
    try {
        const sauce = await Sauce.findOne({ _id: req.params.id });
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
            Sauce.deleteOne({ _id: req.params.id })
                .then(() => {
                    res.status(200).json({ message: 'Object deleted!' });
                })
                .catch((error) => {
                    res.status(400).json({ error });
                });
        });
    } catch (error) {
        res.status(500).json({ error });
    }
};