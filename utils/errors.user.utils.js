module.exports.signUpErrors = (err) => {
    let errors = { firstname: "", lastname: "", email: "", password: "" };

    // Vérifie si l'erreur concerne le prénom
    if (err.message.includes('firstname')) {
        errors.firstname = 'Le prénom est requis.';
    }
    
    // Vérifie si l'erreur concerne le nom de famille
    if (err.message.includes('lastname')) {
        errors.lastname = 'Le nom de famille est requis.';
    }

    // Vérifie si l'erreur concerne l'email
    if (err.message.includes("email")) {
        errors.email = "Email incorrect.";
    }

    // Vérifie si l'erreur concerne le mot de passe
    if (err.message.includes("password")) {
        errors.password = "Le mot de passe doit faire 6 caractères minimum.";
    }

    // Gestion des erreurs de duplication d'email
    if (err.code === 11000) {
        if (Object.keys(err.keyValue).includes("email")) {
            errors.email = "Cette adresse email est déjà enregistrée.";
        }
    }

    return errors;
};

module.exports.signInErrors = (err) => {
    let errors = { email: "", password: "" };


    // Vérifie si l'erreur concerne l'email
    if (err.message.includes("email")) {
        errors.email = "Email inconnu.";
    }

    // Vérifie si l'erreur concerne le mot de passe
    if (err.message.includes("password")) {
        errors.password = "Le mot de passe ne correspond pas";
    }


    return errors;
};

exports.uploadErrors = (err) => {
    let errors = { format : '', maxSize: ""};

    if (err.message.includes("invalid file")) {
        errors.format = "Format incompatible";
    }

    if (err.message.includes("max size")) {
        errors.maxSize = "le fichier dépasse 500ko";
    }

    return errors

}