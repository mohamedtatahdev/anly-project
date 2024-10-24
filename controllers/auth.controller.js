const UserModel = require('../database/models/user.model');
const jwt = require('jsonwebtoken');
const {signUpErrors, signInErrors} = require('../utils/errors.user.utils')

const maxAge = 3 * 24 * 60 * 60 * 1000;

const createToken = (id) => {
    const jwtToken = jwt.sign({id}, process.env.TOKEN_SECRET, {expiresIn: maxAge});
    return jwtToken;
}

module.exports.signUp = async (req, res) => {
    const {firstname, lastname, email, password} = req.body

    try {
        const user = await UserModel.create({firstname, lastname, email, password});
        res.status(201).json({user: user._id})
    }
    catch (err) {
        const errors = signUpErrors(err); // Collecte toutes les erreurs
        res.status(400).json({ errors }); // Renvoie toutes les erreurs avec le statut 400
    }
}

module.exports.signIn = async (req, res) => {
    const { email, password } = req.body;

    try {

        const user = await UserModel.login( email, password );
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge });
        res.status(200).json({ user: user._id });
    } catch (err) {
        const errors = signInErrors(err); // Collecte toutes les erreurs

        res.status(400).json({ errors });
    }
};



module.exports.logout = (req, res) => {
    res.clearCookie('jwt');
    res.redirect('/');
};

