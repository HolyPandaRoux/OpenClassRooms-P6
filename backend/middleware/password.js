
/* Importing the password schema from the models folder. */
const passwordSchema = require("../models/password");

/* middleware that checks if the password is valid. */
module.exports = (req, res, next) => {
    if (!passwordSchema.validate(req.body.password)) {
        res.writeHead(
            400,
            "Votre mot de passe doit se composer de 8 caractères dont un chiffre, sans espaces",
            {
                "content-type": "application/json",
            }
        );
        res.end("Votre mot de passe ne correspond pas aux critères de sécurité.");
    } else {
        next();
    }
};