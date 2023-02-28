const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const maxPicSize = 15 ; // limite de taille de l'image en Mo retirée pour le test

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    filename: (req, file, callback) => {
        const extension = MIME_TYPES[file.mimetype];
        const filename = `${uuidv4()}.${extension}`;
        callback(null, filename);
    },
});

module.exports = multer({
    storage : storage, 
}).single('image');