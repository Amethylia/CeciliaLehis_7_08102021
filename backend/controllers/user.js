const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');

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
    const lastName = req.body.lastName;
    const firstName = req.body.firstName;
    const email = req.body.email;
    const password = req.body.password;

    const selectEmail = "SELECT email FROM user WHERE email = ?;";
    const insertValue = [email];
    verifyEmail = mysql.format(selectEmail, insertValue);
    connection.query(verifyEmail, function(err, resVerifyEmailFunction) {
        if(resVerifyEmailFunction.length === 0) {
            bcrypt.hash(password, 10)
            .then(hash => {
            const signupSql = "INSERT INTO user (last_name, first_name, email, password) VALUES (?, ?, ?, ?);";
            const insertValues = [lastName, firstName, email, hash];
            signup = mysql.format(signupSql, insertValues);
            connection.query(signup, function (err, resSignupFunction) {
                if(!schema.validate(password)) {
                    resExp.status(400).json({ error: 'Le mot de passe doit être composé de 8 caractères dont au moins: 1 majuscule et 1 minuscule. Les espaces ne sont pas autorisés !' });  
                }
                else if(!emailValidator.validate(email)) {
                    resExp.status(400).json({ error: 'Veuillez saisir une adresse mail valide !' });
                }  else {
                    const loginSql = "SELECT id, last_name, first_name, email, password, is_admin FROM user WHERE email = ?;";
                    const insertValue = [email];
                    login = mysql.format(loginSql, insertValue);
                    connection.query(login, function (err, resLoginFunction) {
                        if (!resLoginFunction) {
                            return resExp.status(400).json({ error: 'Utilisateur non trouvé !' });
                        } else {
                            return resExp.status(200).json({
                                message: 'Utilisateur créé et connecté !',
                                userId: resLoginFunction[0]["id"],
                                admin: resLoginFunction[0]["is_admin"],
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
        } else if(resVerifyEmailFunction.length === 1) {
            return resExp.status(400).json({ error: 'Email déjà utilisé !' });
        }
    })
    
};

/* Connexion */
exports.login = (req, resExp, next) => {
    email = req.body.email;
    password = req.body.password;

    const loginSql = "SELECT id, last_name, first_name, email, password, is_admin FROM user WHERE email = ?;";
    const insertValue = [email];
    login = mysql.format(loginSql, insertValue);

    connection.query(login, function (err, resLoginFunction) {
        if (!resLoginFunction) {
            return resExp.status(400).json({ error: 'Utilisateur non trouvé !' });
        } else {
            bcrypt.compare(password, resLoginFunction[0]["password"])
            .then(valid => {
                if (!valid) {
                    return resExp.status(400).json({ error: 'Mot de passe incorrect !' });
                }
                resExp.status(200).json({
                    message: 'Utilisateur connecté !',
                    userId: resLoginFunction[0]["id"],
                    admin: resLoginFunction[0]["is_admin"],
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
    const userId = req.params['id'];

    const getUASql = "SELECT last_name, first_name, email FROM user WHERE id = ?;";
    const insertValue = [userId];
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
    var lastName = req.body.lastName;
    var firstName = req.body.firstName;
    var email = req.body.email;
    const userId = req.params['id'];

    if(lastName == "undefined")
    {
        lastName = null;
    }
    if(firstName == "undefined")
    {
        firstName = null;
    }
    if(email == "undefined")
    {
        email = null;
    }

    const modifyUASql = "UPDATE user SET last_name = IFNULL(?, last_name), first_name = IFNULL(?, first_name), email = IFNULL(?, email) WHERE id = ?;";
    const insertValues = [lastName, firstName, email, userId];
    modifyUserAccount = mysql.format(modifyUASql, insertValues);

    connection.query(modifyUserAccount, function (err, resModifyFunction) {
        if (!resModifyFunction) {
            return resExp.status(400).json({ error: 'La modification du compte a échouée !' });
        } else {
            const sendModifyUASql = "SELECT id, last_name, first_name, email, password FROM user WHERE id = ?;";
            const insertValue = [userId];
            SendModifyUserAccount = mysql.format(sendModifyUASql, insertValue);
            connection.query(SendModifyUserAccount, function (err, resSendModifyUAFunction) {
                if(resSendModifyUAFunction) {
                    return resExp.status(200).json({ 
                        message: "Envoie des données acceptées !",
                        nom: resSendModifyUAFunction[0]["last_name"],
                        prenom: resSendModifyUAFunction[0]["first_name"],
                        email: resSendModifyUAFunction[0]["email"],
                    });
                }
                else {
                    return resExp.status(400).json({ 
                        message: "Envoie des données refusées !"
                    });
                }
            });
        }
    })
};

/* Supprimer un compte utilisateur */
exports.deleteUserAccount = (req, resExp, next) => {
    const userId = req.params['id'];

    const insertValue = [userId];

    const deleteUserAccountSql = "DELETE FROM user WHERE id = ?;";
    deleteUserAccount = mysql.format(deleteUserAccountSql, insertValue);
    connection.query(deleteUserAccount, function (err, resDeleteFunction) {
       
    });

    const deleteImageSql = "SELECT picture_url FROM post WHERE user_id = ?";
    deleteImage = mysql.format(deleteImageSql, insertValue);
    connection.query(deleteImage, function (err, resDeleteImage) {
        if(resDeleteImage) {
            for(let i=0; i < resDeleteImage.length; i++) {              
                if(resDeleteImage[i]["picture_url"] != null) {
                  let imageDelete = resDeleteImage[i]["picture_url"]
                  const filename = imageDelete.split("/images/")[1];
                  fs.unlink(`images/${filename}`, () => {});
                }
              }
        }
    });

    const deleteCommentSql = "DELETE FROM comment WHERE comment.user_id = ?";
    deleteCommentPost = mysql.format(deleteCommentSql, insertValue);
    connection.query(deleteCommentPost, function (err, resDeleteComment) {
        if(resDeleteComment) {
            const deletePostSql = "DELETE FROM post WHERE post.user_id = ?";
            deletePost = mysql.format(deletePostSql, insertValue);
            connection.query(deletePost, function (err, resDeletePost) {
                if(resDeletePost) {
                    return resExp.status(200).json({ message: "Posts et commentaires lié au compte supprimés !" });
                }
            });
        }
    });
};