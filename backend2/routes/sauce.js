const express = require('express');
const router  = express.Router();

const auth    = require('../middleware/auth');
const multer  = require('../middleware/multer-config');

const {
    getOneSauce,
    getAllSauces,
    createSauce,
    modifySauce,
    deleteSauce,
    likeSauce,
} = require('../controllers/sauce');

router.get('/:id',       auth, getOneSauce);
router.get('/',          auth, getAllSauces);
router.post('/sauces',   auth, multer, createSauce);
router.put('/:id',       auth, multer, modifySauce);
router.delete('/:id',    auth, deleteSauce);
router.post('/:id/like', auth,likeSauce);

module.exports = router;

