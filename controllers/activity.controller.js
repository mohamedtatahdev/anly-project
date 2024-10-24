const UserModel = require("../database/models/user.model");
const ActivityModel = require("../database/models/activity.model");
const ObjectId = require("mongoose").Types.ObjectId;

module.exports.readActivity = async (req, res) => {
  try {
    const docs = await ActivityModel.find().sort({ createdAt: -1 }); // Utilisation de `await` pour attendre la réponse
    res.status(200).send(docs); // Renvoie les documents avec un statut 200
  } catch (err) {
    console.error("Erreur pour obtenir les données : " + err);
    res
      .status(500)
      .send({ message: "Erreur pour obtenir les données", error: err });
  }
};

module.exports.createActivity = (req, res) => {
  const body = req.body;
  const newActivity = new ActivityModel(body);

  newActivity
    .save()
    .then((newActivity) => res.status(201).json(newActivity))
    .catch((err) => {
      res.status(400).send(err);
    });
};

module.exports.updateActivity = async (req, res) => {
  // Vérifie si l'ID est valide
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).send("ID inconnu : " + req.params.id);
  }

  try {
    const activityId = req.params.id;
    const updates = req.body; // Récupère les données à partir de req.body

    // Met à jour l'activité
    const updatedActivity = await ActivityModel.findByIdAndUpdate(
      activityId,
      { $set: updates }, // Utilise les données à partir de req.body
      { runValidators: true, new: true } // Les options doivent être passées ensemble
    );

    if (!updatedActivity) {
      return res.status(404).send("Activité non trouvée.");
    }

    // Renvoie l'activité mise à jour avec un statut 200
    res.status(200).send(updatedActivity);
  } catch (err) {
    // Gère les erreurs
    console.error("Erreur lors de la mise à jour de l'activité : ", err);
    res.status(500).send({
      message: "Erreur lors de la mise à jour de l'activité",
      error: err,
    });
  }
};

module.exports.deleteActivity = async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).send("ID inconnu : " + req.params.id);
  }

  try {
    const deletedActivity = await ActivityModel.findByIdAndDelete(
      req.params.id
    );
    if (!deletedActivity) {
      return res.status(404).send("Activity not found");
    }

    res.status(200).json({
      message: "Successfully deleted.",
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.likeActivity = async (req, res) => {
  // Vérifie si l'ID de l'activité est valide
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).send("ID inconnu : " + req.params.id);
  }

  try {
    // Met à jour l'activité pour ajouter le liker
    const updatedActivity = await ActivityModel.findByIdAndUpdate(
      req.params.id,
      {
        $addToSet: { likers: req.body.id }, // Utilise $addToSet correctement
      },
      {
        new: true,
      }
    );

    // Vérifie si l'activité a été trouvée
    if (!updatedActivity) {
      return res.status(404).send("Activité non trouvée.");
    }

    // Met à jour l'utilisateur pour ajouter le like
    const updatedUser = await UserModel.findByIdAndUpdate(
      req.body.id, // Utilise l'ID de l'utilisateur à partir de req.body
      {
        $addToSet: { likes: req.params.id }, // Utilise $addToSet correctement
      },
      {
        new: true,
      }
    );

    // Vérifie si l'utilisateur a été trouvé
    if (!updatedUser) {
      return res.status(404).send("Utilisateur non trouvé.");
    }

    // Renvoie la réponse avec l'activité mise à jour
    res.status(200).send({ activity: updatedActivity, user: updatedUser });
  } catch (err) {
    // Gère les erreurs
    console.error(
      "Erreur lors de la mise à jour de l'activité ou de l'utilisateur : ",
      err
    );
    return res.status(400).send(err);
  }
};

exports.unlikeActivity = async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).send("ID inconnu : " + req.params.id);
  }

  try {
    // Met à jour l'activité pour ajouter le liker
    const updatedActivity = await ActivityModel.findByIdAndUpdate(
      req.params.id,
      {
        $pull: { likers: req.body.id },
      },
      {
        new: true,
      }
    );

    // Vérifie si l'activité a été trouvée
    if (!updatedActivity) {
      return res.status(404).send("Activité non trouvée.");
    }

    // Met à jour l'utilisateur pour ajouter le like
    const updatedUser = await UserModel.findByIdAndUpdate(
      req.body.id, // Utilise l'ID de l'utilisateur à partir de req.body
      {
        $pull: { likes: req.params.id },
      },
      {
        new: true,
      }
    );

    // Vérifie si l'utilisateur a été trouvé
    if (!updatedUser) {
      return res.status(404).send("Utilisateur non trouvé.");
    }

    // Renvoie la réponse avec l'activité mise à jour
    res.status(200).send({ activity: updatedActivity, user: updatedUser });
  } catch (err) {
    // Gère les erreurs
    console.error(
      "Erreur lors de la mise à jour de l'activité ou de l'utilisateur : ",
      err
    );
    return res.status(400).send(err);
  }
};

//comentaires

exports.commentActivity = async (req, res) => {
  // Vérifie si l'ID de l'activité est valide
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).send("ID inconnu : " + req.params.id);
  }

  try {
    // Récupère les données du commentaire depuis req.body
    const { commenterId, commenterAuthor, text } = req.body;

    // Met à jour l'activité en ajoutant le commentaire
    const docs = await ActivityModel.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          comments: {
            commenterId: commenterId,
            commenterAuthor: commenterAuthor,
            text: text,
            timestamp: new Date().getTime(), // Correction ici
          },
        },
      },
      { new: true }
    );

    // Renvoie l'activité mise à jour
    return res.status(200).send(docs);
  } catch (err) {
    return res.status(400).send(err);
  }
};

exports.editCommentActivity = async (req, res) => {
  // Vérifie si l'ID de l'activité est valide
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).send("ID d'activité inconnu : " + req.params.id);
  }

  try {
    // Cherche l'activité par ID
    const docs = await ActivityModel.findById(req.params.id);

    // Vérifie si l'activité a été trouvée
    if (!docs) {
      return res.status(404).send("Activité non trouvée");
    }

    // Trouve le commentaire à modifier
    const theComment = docs.comments.find((comment) =>
      comment._id.equals(req.body.commentId)
    );

    // Vérifie si le commentaire a été trouvé
    if (!theComment) {
      return res.status(404).send("Commentaire non trouvé");
    }

    // Met à jour le texte du commentaire et le timestamp
    theComment.text = req.body.text;
    theComment.timestamp = new Date().getTime(); // Mettez à jour le timestamp si nécessaire

    // Enregistre les modifications
    await docs.save();

    // Renvoie le document mis à jour
    return res.status(200).send(docs);
  } catch (err) {
    return res.status(500).send(err); // En cas d'erreur, renvoie un statut 500
  }
};

exports.deleteCommentActivity = async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).send("ID inconnu : " + req.params.id);
  }

  try {
    // Met à jour l'activité en ajoutant le commentaire
    const docs = await ActivityModel.findByIdAndUpdate(
      req.params.id,
      {
        $pull: {
          comments: {
            _id: req.body.commentId,
          },
        },
      },
      { new: true }
    );

    // Renvoie l'activité mise à jour
    return res.status(200).send(docs);
  } catch (err) {
    return res.status(400).send(err);
  }
};
