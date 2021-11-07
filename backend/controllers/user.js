const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const config = require('../database/config.js');
const connection = mysql.createConnection(config.databaseOptions);

/* EmailValidator */
const emailValidator = require('email-validator');

/* PasswordValidator */
const passwordValidator = require('password-validator');
const schema = new passwordValidator();
schema
.is().min(8)                                
.is().max(30)                               
.has().uppercase()                           
.has().lowercase()
.has().not().spaces()                           
.is().not().oneOf(['Passw0rd', 'Password123']);


/* Inscription */
exports.signup = (req, resExp, next) => {
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        const signupSql = "INSERT INTO user (last_name, first_name, email, password) VALUES (?, ?, ?, ?);";
        const insertValues = [req.body.lastName, req.body.firstName, req.body.email, hash];
        signup = mysql.format(signupSql, insertValues);
        connection.query(signup, function (err, resSignupFunction) {
            if(!schema.validate(req.body.password) && !emailValidator.validate(req.body.email)) {
                let message = "";
                if(!schema.validate(req.body.password)) {
                    message = 'Le mot de passe doit être composé de 8 caractères dont au moins: 1 majuscule et 1 minuscule. Les espaces ne sont pas autorisés.'   
                }
                else if(!emailValidator.validate(req.body.email)) {
                    message = 'Veuillez saisir une adresse mail valide.'
                } 
                resExp.status(400).json({ message });
            } else {
                const loginSql = "SELECT id, last_name, first_name, email, password FROM user WHERE email = ?;";
                const insertValues = [req.body.email];
                login = mysql.format(loginSql, insertValues);
                connection.query(login, function (err, resLoginFunction) {
                    if (!resLoginFunction) {
                        return resExp.status(400).json({ error: 'Utilisateur non trouvé !' });
                    } else {
                        return resExp.status(200).json({
                            message: 'Utilisateur créé et connecté !',
                            userId: resLoginFunction[0]["id"],
                            token: jwt.sign(
                                { userId: resLoginFunction[0]["id"] },
                                'RANDOM_TOKEN_SECRET',
                                { expiresIn: '24h' }
                            )
                        });
                    }
                })
            }
        })
    })
    .catch(error => resExp.status(500).json({ error }));
};

/* Connexion */
exports.login = (req, resExp, next) => {
    const loginSql = "SELECT id, last_name, first_name, email, password FROM user WHERE email = ?;";
    const insertValue = [req.body.email];
    login = mysql.format(loginSql, insertValue);
    connection.query(login, function (err, resLoginFunction) {
        if (!resLoginFunction) {
            return resExp.status(400).json({ error: 'Utilisateur non trouvé !' });
        } else {
            bcrypt.compare(req.body.password, resLoginFunction[0]["password"])
            .then(valid => {
                if (!valid) {
                    return resExp.status(400).json({ error: 'Mot de passe incorrect !' });
                }
                resExp.status(200).json({
                    message: 'Utilisateur connecté !',
                    userId: resLoginFunction[0]["id"],
                    token: jwt.sign(
                        { userId: resLoginFunction[0]["id"] },
                        'RANDOM_TOKEN_SECRET',
                        { expiresIn: '24h' }
                    )
                });
            })
            .catch(error => resExp.status(500).json({ error }));
        }
    })
};

/* Récupérer un compte utilisateur */
exports.getUserAccount = (req, resExp, next) => {
    const getUASql = "SELECT last_name, first_name, email FROM user WHERE id = ?;";
    const insertValue = [req.params.id];
    getUserAccount = mysql.format(getUASql, insertValue);
    connection.query(getUserAccount, function (err, resGetUAFunction) {
        if (!resGetUAFunction) {
            return resExp.status(400).json({ error: 'Utilisateur non trouvé !' });
        } else {
            return resExp.status(200).json({
                message: 'Utilisateur trouvé !',
                nom: resGetUAFunction[0]["last_name"],
                prenom: resGetUAFunction[0]["first_name"],
                email: resGetUAFunction[0]["email"]
            });
        }
    })
};

/* Modifier un compte utilisateur */
exports.modifyUserAccount = (req, resExp, next) => {
    const modifyUASql = "UPDATE user SET last_name = IFNULL(?, last_name), first_name = IFNULL(?, first_name) WHERE id = ?;";
    const insertValues = [req.body.lastName, req.body.firstName, req.params.id];
    modifyUserAccount = mysql.format(modifyUASql, insertValues);
    connection.query(modifyUserAccount, function (err, resModifyFunction) {
        if (!resModifyFunction) {
            return resExp.status(400).json({ error: 'La modification du compte a échouée !' });
        } else {
            const sendModifyUASql = "SELECT id, last_name, first_name, email, password FROM User WHERE id = ?;";
            const insertValue = [req.params.id];
            SendModifyUserAccount = mysql.format(sendModifyUASql, insertValue);
            connection.query(SendModifyUserAccount, function (err, resSendModifyUAFunction) {
                if (!resSendModifyUAFunction) {
                    return resExp.status(400).json({ error: 'Envoie des données refusées !' });
                } else {
                    return resExp.status(200).json({ 
                        message: 'Envoie des données acceptées !',
                        nom: resSendModifyUAFunction[0]["last_name"],
                        prenom: resSendModifyUAFunction[0]["first_name"]
                    });
                }
            })
        }
    })
};

/* Supprimer un compte utilisateur */
exports.deleteUserAccount = (req, resExp, next) => {
    const deleteUserAccountSql = "DELETE FROM user WHERE id = ?;";
    const insertValue = [req.params.id];
    deleteUserAccount = mysql.format(deleteUserAccountSql, insertValue);
    connection.query(deleteUserAccount, function (err, resDeleteFunction) {
        if (!resDeleteFunction) {
            return resExp.status(400).json({ error: 'La suppression du compte a échouée !' });
        } else {
            return resExp.status(200).json({ message: 'La suppression du compte a réussi !' });
        }
    })
};