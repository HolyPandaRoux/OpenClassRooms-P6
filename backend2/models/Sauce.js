const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const sauceSchema = mongoose.Schema(
    {
        userId: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 50,
            trim: true,
            unique: true,
            validate: {
                validator: function (value) {
                    return /^[a-zA-Z0-9éèàêîôûçäëïöüŸ]+$/.test(value);
                },
                message: "N'entrez que des lettres, des chiffres et certains caractères spéciaux (éèàêîôûçäëïöüŸ), svp"
            }
        },
        manufacturer: {
            type: String,
            minlength: 3,
            maxlength: 50,
            trim: true,
            validate: {
                validator: function (value) {
                    return /^[a-zA-Z0-9éèàêîôûçäëïöüŸ\s\-']+$/i.test(value);
                },
                message: "N'entrez que des lettres, des chiffres et certains caractères spéciaux (éèàêîôûçäëïöüŸ), svp"
            }
        },
        description: {
            type: String,
            minlength: 10,
            maxlength: 300,
            trim: true,
            validate: {
                validator: function (value) {
                    return /^[a-zA-Z0-9éèàêîôûçäëïöüŸ\s\-'\(\),.:;!]+$/i.test(value);
                },
                message: "N'entrez que des lettres, des chiffres et certains caractères spéciaux (éèàêîôûçäëïöüŸ), svp"
            }
        },
        mainPepper: {
            type: String,
            minlength: 3,
            maxlength: 50,
            trim: true,
            validate: {
                validator: function (value) {
                    return /^[a-zA-Z0-9éèàêîôûçäëïöüŸ\s\-']+$/i.test(value);
                },
                message: "N'entrez que des lettres, des chiffres et certains caractères spéciaux (éèàêîôûçäëïöüŸ), svp"
            }
        },
        heat: {
            type: Number,
            min: 0,
            max: 10
        },
        imageUrl: {
            type: String
        },
        likes: {
            type: Number,
            default: 0
        },
        dislikes: {
            type: Number,
            default: 0
        },
        usersLiked: {
            type: [String],
            default: []
        },
        usersDisliked: {
            type: [String],
            default: []
        }
    },
    {
        timestamps: true,
        select: '-__v' // exclude the '__v' field from the query results
    }
);

sauceSchema.plugin(uniqueValidator, { message: 'Ce {PATH} est déjà utilisé.' });
module.exports = mongoose.model('Sauce', sauceSchema);
