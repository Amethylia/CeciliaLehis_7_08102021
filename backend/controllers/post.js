const mysql = require('mysql2');
const fs = require('fs');

const config = require('../database/config.js');
const connection = mysql.createConnection(config.databaseOptions);

/* Récupération de tous les posts */
exports.getAllPosts = (req, resExp, next) => {
    const getAllPosts = "SELECT id FROM post;";
    connection.query(getAllPosts, function (err, resGetAllPostsFunction) {
        if(!resGetAllPostsFunction) {
            return resExp.status(400).json({ error: 'Aucun post publié !' });
        } else {
            return resExp.status(200).json({ mesage: "Voici le(s) post(s) publié(s) !" });
        }
    });
}

/* Récupération d'un post */
exports.getPost = (req, resExp, next) => {
    const getPostSql = "SELECT title, picture_url, description FROM post WHERE id = ?";
    const InsertValue = [req.params.id];
    getPost = mysql.format(getPostSql, InsertValue);
    connection.query(getPost, function (err, resGetPostFunction) {
        if(!resGetPostFunction) {
            return resExp.status(400).json({ error: 'Aucun post récupéré !' });
        } else {
            return resExp.status(200).json({
                message: 'Post récupéré !',
                titre: resGetPostFunction[0]["title"],
                image: resGetPostFunction[0]["picture_url"],
                description: resGetPostFunction[0]["description"]
        });
        }
    });
}

/* Création d'un post */
exports.createPost = (req, resExp, next) => {
    const userId = res.UserId;
    const imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
    const createPostSql = "INSERT INTO post (user_id, title, picture_url, description) VALUES (?, ?, ?, ?);";
    const insertValues = [userId, req.body.title, imageUrl, req.body.description];
    createPost = mysql.format(createPostSql, insertValues);
    connection.query(createPost, function (err, resCreatePostFunction){
        if (!resCreatePostFunction){
            return resExp.status(400).json({ error: 'Création du post refusée !' });
        } else {
            return resExp.status(200).json({ message: 'Création du post réussie !' });
        }
    })
};

/* Modification d'un post */
exports.modifyPost = (req, resExp, next) => {
    const imageUrl = "`${req.protocol}://${req.get('host')}/images/${req.file.filename}`";
    const modifyInfosPost = "UPDATE post SET title = IFNULL(?, title), picture_url = IFNULL(?, picture_url), description = IFNULL(?, description) WHERE id = ?;";
    const insertValues = [req.body.title, imageUrl, req.body.description, req.params.id];
    modifyPost = mysql.format(modifyInfosPost, insertValues);
    connection.query(modifyPost, function (err, resModifyPostFunction) {
        if(!resModifyPostFunction) {
            return resExp.status(400).json({ error: 'Modification du post refusée !' });
        } else {
            const selectImagePost = "SELECT picture_url FROM post WHERE id = ?;";
            const insertValue = [req.params.id];
            imagePost = mysql.format(selectImagePost, insertValue);
            connection.query(imagePost, function (err, resImagePostFunction) {
                if(imageUrl) {
                    const filename = resImagePostFunction[0]["picture_url"].split("/images/")[1];
                    fs.unlink(`images/${filename}`, () => {});
                    return resExp.status(200).json({ message: "Modification du post réussie & suppression de l'ancienne image du dossier images réussie !" });
                } else {
                    return resExp.status(200).json({ message: "Pas d'image à supprimer du dossier image & modification du post réussie !" });
                }
            });
        }
    });
};

/* Suppression d'un post */
exports.deletePost = (req, resExp, next) => {
    const imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
    const deletePostSql = "DELETE FROM post WHERE id = ?;";
    const insertValue = [req.params.id];
    deletePost = mysql.format(deletePostSql, insertValue);
    connection.query(deletePost, function (err, resDeletePostFunction) {
        if(!resDeletePostFunction) {
            return resExp.status(400).json({ error: 'Pas de post à supprimer !' });
        } else {
            if(imageUrl) {
                const filename = imageUrl.split("/images/")[1];
                fs.unlink(`images/${filename}`, () => {});
                return resExp.status(200).json({ message: "Post supprimé de la base de données & suppression de l'image du dossier images réussie !" });
            }
        }
    });
};