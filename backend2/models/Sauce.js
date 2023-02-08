const mongoose = require('mongoose');
//modele de sauce
const sauceSchema = mongoose.Schema({ 
    userId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
        minlength: [5],
        maxlength: [30],
        validate: {
            validator: function(value){
                return /^[^@&"<>!_$*€£`+=\/';?#-]+$/.test(value);
            },
            message: "N'entrez que des lettres et des chiffres, svp"
        }   
    },
    manufacturer: {
        type: String,
        minlength: [5, "pas moins de 5 caratères"],
        maxlength: [50, "pas plus de 50 caractères"],
        validate: {
            validator: function(value){
                return /^[^@&"<>!_$*€£`'+=\/;?#-]+$/.test(value);
            },
            message: "N'entrez que des lettres et des chiffres, svp"
        }
    },
    description: {
        type: String,
        minlength: [15, "pas moins de 15 caratères"],
        maxlength: [100, "pas plus de 100 caractères"],
        validate: {
            validator: function(value){
                return /^[^@&"<>!_$*€£`+'=\/;?#-]+$/.test(value);
            },
            message: "N'entrez que des lettres et des chiffres, svp"
        }
    },
    mainPepper: {
        type: String,
        minlength: [5, "pas moins de 5 caratères"],
        maxlength: [30, "pas plus de 30 caractères"],
        validate: {
            validator: function(value){
                return /^[^@&"<>!_$*€£`'+=\/;?#-]+$/.test(value);
            },
            message: "N'entrez que des lettres et des chiffres, svp"
        }
    },
    heat: { type: Number },
    imageUrl: { type: String },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    usersLiked: { type: Array, default: [] },
    usersDisliked: { type: Array, default: [] },
});



module.exports = mongoose.model('Sauce', sauceSchema);
