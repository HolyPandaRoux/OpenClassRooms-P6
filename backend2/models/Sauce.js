const mongoose = require('mongoose');

const sauceSchema = mongoose.Schema(
    {
        userId: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true,
            minlength: 5,
            maxlength: 30,
            trim: true,
            validate: {
                validator: function (value) {
                    return /^[a-zA-Z0-9]+$/.test(value);
                },
                message: "N'entrez que des lettres et des chiffres, svp"
            }
        },
        manufacturer: {
            type: String,
            minlength: 5,
            maxlength: 50,
            trim: true,
            validate: {
                validator: function (value) {
                    return /^[a-zA-Z0-9]+$/.test(value);
                },
                message: "N'entrez que des lettres et des chiffres, svp"
            }
        },
        description: {
            type: String,
            minlength: 15,
            maxlength: 100,
            trim: true,
            validate: {
                validator: function (value) {
                    return /^[a-zA-Z0-9]+$/.test(value);
                },
                message: "N'entrez que des lettres et des chiffres, svp"
            }
        },
        mainPepper: {
            type: String,
            minlength: 5,
            maxlength: 30,
            trim: true,
            validate: {
                validator: function (value) {
                    return /^[a-zA-Z0-9]+$/.test(value);
                },
                message: "N'entrez que des lettres et des chiffres, svp"
            }
        },
        heat: {
            type: Number,
            enum: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        },
        imageUrl: {
            type: String,
            trim: true
        },
        likes: { type: Number, default: 0 },
        dislikes: { type: Number, default: 0 },
        usersLiked: { type: Array, default: [] },
        usersDisliked: { type: Array, default: [] },
    },
    {
        timestamps: true,
        select: '-__v' // exclude the '__v' field from the query results
    }
);

module.exports = mongoose.model('Sauce', sauceSchema);
