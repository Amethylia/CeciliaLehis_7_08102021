const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const db = require('../database/config');

exports.createPost = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;

    const imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;

    const createPost = "INSERT INTO post (user_id, title, picture_url, description) VALUES (?, ?, ?, ?);";
    const insertValues = [userId, req.body.title, req.body.description, imageUrl];
    createPost = mysql.format(createPost, insertValues);

    db.query(createPost, function (err, res){
        if (!res){
            return res.status(401).json({ error: 'Création du post refusée !' });
        } else {
            return res.status(201).json({ message: 'Création du post réussie !' });
        }
    })
};

exports.modifyPost = (req, res, next) => {
    const imageUrl = "";
    if(req.file) {
        imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
    }

    const selectImagePost = "SELECT picture_url FROM post WHERE id = ?;";
    const insertValue = [req.params.id];
    imagePost = mysql.format(selectImagePost, insertValue);

    db.query(imagePost, function (err, res) {
        if(!res) {
            return res.status(401).json({ error: 'Modification du post refusée !' });
        } else {
            if(res.picture_url) {
                const filename = res.picture_url.split("/images/")[1];
                fs.unlink(`images/${filename}`, () => {});
                return res.status(201).json({ message: "Suppression de l'image du dossier images réussie !" });
            } else {
                return res.status(401).json({ error: "Suppression de l'image du dossier images refusée !" });
            }
        }
    });

    const modifyInfosPost = "UPDATE post SET title = ?, picture_url = ?, description = ? WHERE id = ?;";
    const insertValues = [req.params.id, imageUrl, req.body.description, req.params.id];
    modifyPost = mysql.format(modifyInfosPost, insertValues);

    db.query(modifyPost, function (err, res) {
        if(!res) {
            return res.status(401).json({ error: 'Modification du post refusée !' });
        } else {
            return res.status(201).json({ mesage: "Modification du post réussie !" });
        }
    });
};