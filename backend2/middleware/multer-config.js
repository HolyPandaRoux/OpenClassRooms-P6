const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const maxPicSize = 1024 * 1024 * 5; // 5MB
const timestamp = Date.now();

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
        const filename = `${timestamp}-{uuidv4()}.${extension}`;
        callback(null, filename);
    },
});

module.exports = multer({
    storage : storage,
    limits: {
        fileSize: maxPicSize,
    },
}).single('image');