const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const config = require('../database/config.js');
const connection = mysql.createConnection(config.databaseOptions);

/* Récupération de tous les posts */
exports.getAllPosts = (req, resExp, next) => {
    const getAllPosts = "SELECT post.id, user_id, title, picture_url, description, last_name, first_name FROM post INNER JOIN user ON post.user_id = user.id";
    connection.query(getAllPosts, function (err, resGetAllPostsFunction) {
        if(!resGetAllPostsFunction) {
            return resExp.status(400).json({ error: 'Aucun post publié !' });
        } else {
            return resExp.status(200).json({ 
                message: "Voici le(s) post(s) publié(s) !",
                resGetAllPostsFunction });
        }
    });
}

/* Création d'un post */
exports.createPost = (req, resExp, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;

    const title = req.body.title;
    const description = req.body.description;

    const imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;

    const createPostSql = "INSERT INTO post (user_id, title, picture_url, description) VALUES (?, ?, ?, ?);";
    const insertValues = [userId, title, imageUrl, description];
    if (imageUrl) {
        createPost = mysql.format(createPostSql, insertValues);
    connection.query(createPost, function (err, resCreatePostFunction){
        if (!resCreatePostFunction){
            return resExp.status(400).json({ error: 'Création du post refusée !' });
        } else {
            return resExp.status(200).json({ message: 'Création du post réussie !' });
        }
    })
    }
};

/* Modification d'un post */
exports.modifyPost = (req, resExp, next) => {
    var title = req.body.title;
    var description = req.body.description;
    const postId = req.params['id'];

    imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
    
    const selectURL = "SELECT picture_url FROM post WHERE post.id = ?";
    const insertValue = [postId];
    if(imageUrl)
    {
        imagePost = mysql.format(selectURL, insertValue);
        connection.query(imagePost, function (err, resSelectPost) {
            if(resSelectPost) { // Suppression de l'image réussi
                const filename = resSelectPost[0]["picture_url"].split("/images/")[1];
                fs.unlink(`images/${filename}`, () => {});
            } else {
                return resExp.status(400).json({ error: "Post non trouvé" });
            }
        });
    }
    
    const modifyInfosPost = "UPDATE post SET title = ?, picture_url = ?, description = ? WHERE post.id = ?";
    const insertValues = [title, imageUrl, description, postId];
    modifyPost = mysql.format(modifyInfosPost, insertValues);
    connection.query(modifyPost, function (err, resModifyPostFunction) {
        if(!resModifyPostFunction) {
            return resExp.status(400).json({ error: 'Modification du post refusée !' });
        } 
        else {
            const selectImagePost = "SELECT post.id, user_id, title, picture_url, description, last_name , first_name FROM post INNER JOIN user ON post.user_id = user.id WHERE post.id = ?";
            const insertValue = [postId];
            imagePost = mysql.format(selectImagePost, insertValue);
            connection.query(imagePost, function (err, resSelectPost) {
                if(resSelectPost) {
                    return resExp.status(200).json({ 
                        message: "Modification du post réussie !",
                        resSelectPost
                    });
                }
                else {
                    return resExp.status(400).json({ error: 'Post non retrouvé !' });
                }
            });
        }
    });
};

/* Suppression d'un post */
exports.deletePost = (req, resExp, next) => {
    const postId = req.params['id'];

    const deleteImageSql = "SELECT picture_url FROM post WHERE post.id = ?";
    const insertValue = [postId];
    deleteImage = mysql.format(deleteImageSql, insertValue);
    connection.query(deleteImage, function (err, resDeleteImage) {
        if(resDeleteImage) {
            const filename = resDeleteImage[0]["picture_url"].split("/images/")[1];
            fs.unlink(`images/${filename}`, () => {});
        }
    });
    
    const deleteCommentSql = "DELETE FROM comment WHERE comment.post_id = ?";
    const insertValues = [postId];
    deleteCommentPost = mysql.format(deleteCommentSql, insertValues);
    connection.query(deleteCommentPost, function (err, resDeleteComment) {
        if(resDeleteComment) {
            const deletePostSql = "DELETE FROM post WHERE post.id = ?";
            const insertValues = [postId];
            deletePost = mysql.format(deletePostSql, insertValues);
            connection.query(deletePost, function (err, resDeletePost) {
                if(resDeletePost) {
                    return resExp.status(200).json({ message: "Post et commentaires supprimés !" });
                }
            });
        }
    });
};