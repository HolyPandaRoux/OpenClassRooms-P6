//adding the current timestamp to the filename, which may cause issues if two files with the same name are uploaded at the same time
//UUIDv4  generate a unique filename:

const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const maxPicSize = 1024 * 1024 * 5; // 5MB

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
    limits: {
        fileSize: maxPicSize,
    },
}).single('image');
