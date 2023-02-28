const express = require('express');
const router  = express.Router();


const auth        = require('../middleware/auth');
const multer      = require('../middleware/multer-config');
const ctrlSauce   = require('../controllers/sauce');


router.get('/:id',       auth, ctrlSauce.getOneSauce);
router.get('/',          auth, ctrlSauce.getAllSauces);
router.post('/',         auth, multer, ctrlSauce.createSauce);
router.put('/:id',       auth, multer, ctrlSauce.modifySauce);
router.delete('/:id',    auth, ctrlSauce.deleteSauce);
router.post('/:id/like', auth,ctrlSauce.likeSauce);


module.exports = router;

