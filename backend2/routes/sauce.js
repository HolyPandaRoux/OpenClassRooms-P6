const express = require('express');
const router = express.Router();

const sauce            = require('../middleware/sauce');
const auth             = require('../middleware/auth');
const multer           = require('../middleware/multer-config');

const saucesControllers = require('../controllers/sauce');

router.get   ('/:id'     , auth, saucesControllers.getOneSauce);
router.get   ('/'        , auth, saucesControllers.getAllSauces);

router.post  ('/sauces'  , auth, multer, saucesControllers.createSauce);
router.put   ('/:id'     , auth, multer, saucesControllers.modifySauce);

router.delete('/:id'     , auth, saucesControllers.deleteSauce);

router.post  ('/:id/like', auth, sauce.likeSauce);


module.exports = router;