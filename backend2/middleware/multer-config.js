const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const maxPicSize = 15 ; // limite de taille de l'image en Mo retirée pour le test

//Defines an object MIME_TYPES that maps different MIME types to file extensions for validation purposes.you can choose the type image file type you accept in the app
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};
// defines a diskStorage object for the multer middleware. This object specifies where to store the uploaded file and how to name it.
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
//specifies how to name the uploaded file by using the original file name and the uuid package to generate a unique id.
    filename: (req, file, callback) => {
        const extension = MIME_TYPES[file.mimetype];
        const filename = `${uuidv4()}.${extension}`;
        callback(null, filename);
    },
});

module.exports = multer({
    storage : storage, 
}).single('image');