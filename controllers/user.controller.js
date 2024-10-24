const UserModel = require ('../database/models/user.model');
const ObjectId = require('mongoose').Types.ObjectId;

//afiche tous les utilisateurs
module.exports.getAllUsers = async (req, res) => {
    const users = await UserModel.find().select('-password');
    res.status(200).json(users);
}

//afiche un utilisateur
module.exports.userInfo = async (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send('ID unknown :' + req.params.id);

    try {
        const user = await UserModel.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.status(200).json(user);
    } catch (err) {
        console.log('Error fetching user by ID:', err);
        res.status(500).send('Server error');
    }
};

//modifier un utilisateur
module.exports.updateUser = async (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send('ID unknown :' + req.params.id);

    try {
        const updatedUser = await UserModel.findOneAndUpdate(
            { _id: req.params.id },
            {
                $set: {
                    bio: req.body.bio
                }
            },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        if (!updatedUser) {
            return res.status(404).send('User not found');
        }

        return res.send(updatedUser);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

module.exports.deleteUser = async (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send('ID unknown: ' + req.params.id);

    try {
        const deletedUser = await UserModel.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).send('User not found');
        }

        res.status(200).json({
            message: "Successfully deleted."
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

module.exports.follow = async (req, res) => {
    if (!ObjectId.isValid(req.params.id) || !ObjectId.isValid(req.body.idToFollow))
        return res.status(400).send('ID unknown: ' + req.params.id);

    try {
        // Ajouter à la liste des "following" de l'utilisateur qui effectue l'action
        const updatedUser = await UserModel.findByIdAndUpdate(
            req.params.id,
            { $addToSet: { following: req.body.idToFollow } },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );
        
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Ajouter à la liste des "followers" de l'utilisateur suivi
        const updatedFollowedUser = await UserModel.findByIdAndUpdate(
            req.body.idToFollow,
            { $addToSet: { followers: req.params.id } },  // Correction : followers au lieu de following
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );
        
        if (!updatedFollowedUser) {
            return res.status(404).json({ message: "Followed user not found" });
        }

        res.status(201).json({ message: "Successfully followed user" });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

module.exports.unfollow = async (req, res) => {
    if (!ObjectId.isValid(req.params.id) || !ObjectId.isValid(req.body.idToUnfollow))
        return res.status(400).send('ID unknown: ' + req.params.id);

    try {
        // Retirer de la liste "following" de l'utilisateur qui effectue l'action
        const updatedUser = await UserModel.findByIdAndUpdate(
            req.params.id,
            { $pull: { following: req.body.idToUnfollow } },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );
        
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Retirer de la liste des "followers" de l'utilisateur qui est suivi
        const updatedFollowedUser = await UserModel.findByIdAndUpdate(
            req.body.idToUnfollow,
            { $pull: { followers: req.params.id } },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );
        
        if (!updatedFollowedUser) {
            return res.status(404).json({ message: "Followed user not found" });
        }

        res.status(200).json({ message: "Successfully unfollowed user" });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};
