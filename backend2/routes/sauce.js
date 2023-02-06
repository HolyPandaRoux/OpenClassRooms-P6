const express = require('express');
const router = express.Router();

const sauceControllers = require('../middleware/sauce');
const auth             = require('../middleware/auth');
const multer           = require('../middleware/multer-config');

router.post  ('/sauces' , auth, );
router.post  ('/sauces' , auth, );
router.post  ('/'        , auth, multer, sauceControllers.createSauce); // authentification placée en 1er 
router.put   ('/:id'     , auth, multer, sauceControllers.modifySauce);
router.delete('/:id'     , auth, sauceControllers.deleteSauce);
router.get   ('/:id'     , auth, sauceControllers.getOneSauce);
router.get   ('/'        , auth, sauceControllers.getAllSauces);
router.post  ('/:id/like', auth, sauceControllers.likeSauce);

module.exports = router; // export du router