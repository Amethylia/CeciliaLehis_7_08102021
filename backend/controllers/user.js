const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const db = require('../database/config');

/* MaskData */
const MaskData = require('maskdata');
const emailMask2Options = {
    maskWith: "*", 
    unmaskedStartCharactersBeforeAt: 2,
    unmaskedEndCharactersAfterAt: 2,
    maskAtTheRate: false
};

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
exports.signup = (req, res, next) => {
    const email = MaskData.maskEmail2(req.body.email, emailMask2Options);
    bcrypt
    .hash(req.body.password, 10)
    .then(hash => {
        const signupSql = "INSERT INTO user (last_name, first_name, email, password) VALUES (?, ?, ?, ?)";
        const insertValues = [req.body.lastName, req.body.firstName, email, hash];
        signup = mysql.format(signupSql, insertValues);

        db.query(signup, function (err, res) {
            if(!schema.validate(req.body.password) && !emailValidator.validate(req.body.email)) {
                let message = "";
                if(!schema.validate(req.body.password)) {
                    message = 'Le mot de passe doit être composé de 8 caractères dont au moins: 1 majuscule et 1 minuscule. Les espaces ne sont pas autorisés.'   
                }
                else if(!emailValidator.validate(req.body.email)) {
                    message = 'Veuillez saisir une adresse mail valide.'
                } 
                res.status(400).json({ message });
            } else {
                const loginSql = "SELECT id, last_name, first_name, email, password FROM user WHERE email = ?";
                const insertValues = [email];
                login = mysql.format(loginSql, insertValues);

                db.query(login, function (err, res) {
                    if (!res) {
                        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
                    } else {
                        return res.status(201).json({
                            message: 'Utilisateur créé et connecté !',
                            userId: res.id,
                            token: jwt.sign(
                                { userId: res.id },
                                'RANDOM_TOKEN_SECRET',
                                { expiresIn: '24h' }
                            )
                        });
                    }
                })
            }
        })
    })
    .catch(error => res.status(500).json({ error }));
};

/* Connexion */
exports.login = (req, res, next) => {
    const email = MaskData.maskEmail2(req.body.email, emailMask2Options);

    const loginSql = "SELECT id, last_name, first_name, email, password FROM user WHERE email = ?";
    const insertValues = [email];
    login = mysql.format(loginSql, insertValues);

    db.query(login, function (err, res) {
        if (!res) {
            return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        } else {
            bcrypt
            .compare(req.body.password, res.password)
            .then(valid => {
                if (!valid) {
                    return res.status(401).json({ error: 'Mot de passe incorrect !' });
                }
                res.status(200).json({
                    userId: res.id,
                    token: jwt.sign(
                        { userId: res.id },
                        'RANDOM_TOKEN_SECRET',
                        { expiresIn: '24h' }
                    )
                });
            })
            .catch(error => res.status(500).json({ error }));
        }
    })
};

/* Récupérer un compte utilisateur */
exports.getUserAccount = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;

    if (req.body.userId && req.body.userId !== userId) {
        const getUASql = "SELECT last_name, first_name, email FROM user WHERE id = ?";
        const insertValues = [userId];
        getUserAccount = mysql.format(getUASql, insertValues);

        db.query(getUserAccount, function (err, res) {
            if (!res) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            } else {
                return res.status(201).json({
                    message: 'Utilisateur trouvé',
                    nom: res.nom,
                    prenom: res.prenom,
                    email: res.email
                });
            }
        }) 
    } else {
        return res.status(401).json({ error: "La récupération des données de l'utilisateur est refusée !" });
    }
};

/* Supprimer un compte utilisateur */
exports.deleteUserAccount = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;

    if (req.body.userId && req.body.userId !== userId) {
        const deleteUASql = "DELETE FROM user FROM user WHERE id = ?";
        const insertValues = [userId];
        deleteUserAccount = mysql.format(deleteUASql, insertValues);

        db.query(deleteUserAccount, function (err, res) {
            if (!res) {
                return res.status(401).json({ error: 'La suppression du compte a échouée !' });
            } else {
                return res.status(201).json({ message: 'La suppression du compte a réussi !' });
            }
        }) 
    } else {
        return res.status(401).json({ error: "La suppression des données de l'utilisateur est refusée !" });
    }
};