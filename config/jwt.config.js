const jwt = require('jsonwebtoken');
const UserModel = require('../database/models/user.model')


module.exports.checkUser = async (req, res, next) => {
    const token = req.cookies.jwt;

    if (token) {
        try {
            // Vérifie le token et obtient le payload décodé
            const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);

            // Trouve l'utilisateur en utilisant l'ID du token
            let user = await UserModel.findById(decodedToken.id); // ou decodedToken.sub selon comment tu l'as créé
            res.locals.user = user; // Utilisation correcte de res.locals
            next();
        } catch (err) {
            // En cas d'erreur, nettoie le cookie et passe au middleware suivant
            res.locals.user = null;
            res.clearCookie('jwt');
            next();
        }
    } else {
        // Si pas de token, l'utilisateur est nul
        res.locals.user = null;
        next();
    }
};

module.exports.requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
            if (err) {
                console.log(err);
                // Optionnel : tu peux décider de renvoyer une réponse 401 ici
                return res.status(401).json({ message: "Unauthorized" });
            } else {
                console.log(decodedToken.id); // Affiche l'ID décodé
                // Optionnel : ici, tu pourrais stocker l'utilisateur dans res.locals ou dans req
                // Par exemple :
                // req.userId = decodedToken.id;
                next(); // Continue avec le middleware suivant
            }
        });
    } else {
        console.log('No token');
        // Optionnel : tu peux renvoyer une réponse 401 ici aussi
        return res.status(401).json({ message: "Unauthorized" });
    }
};


