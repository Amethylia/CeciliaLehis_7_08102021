const mysql = require('mysql2');
const jwt = require('jsonwebtoken');

const config = require('../database/config.js');
const connection = mysql.createConnection(config.databaseOptions);

/* Récupération de tous les commentaires */
exports.getAllComments = (req, resExp, next) => {
    const postId = req.params['post_id'];
    const getAllCommentsSql = "SELECT comment.id, comment, DATE_FORMAT(comment.date, '%d/%m/%Y') AS date, comment.user_id, first_name, last_name FROM comment JOIN user on comment.user_id = user.id WHERE post_id = ?;";
    const insertValue = [postId];
    getAllcomments = mysql.format(getAllCommentsSql, insertValue);
    connection.query(getAllcomments, function (err, resGetAllCommentsFunction) {
        if(!resGetAllCommentsFunction) {
            return resExp.status(400).json({ error: 'Aucun commentaire publié !' });
        } else {
            return resExp.status(200).json({ 
                message: "Voici le(s) commentaire(s) publié(s) !",
                resGetAllCommentsFunction
            });
        }
    });
}

/* Création d'un commentaire */
exports.createComment = (req, resExp, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;

    const comment = req.body.comment;
    const postId = req.body.postId;

    const createCommentSql = "INSERT INTO comment (user_id, post_id, comment, date) VALUES (?, ? , ?, ?);";
    const insertValues = [userId, postId, comment, new Date()];
    createComment = mysql.format(createCommentSql, insertValues);
    connection.query(createComment, function (err, resCreateCommentFunction){
        if (!resCreateCommentFunction){
            return resExp.status(400).json({ error: 'Création du commentaire refusée !' });
        } else {
            const selectCommentSql = "SELECT comment, date , last_name , first_name FROM comment INNER JOIN user ON comment.user_id = user.id WHERE comment.id = ?;";
            const insertValues = [resCreateCommentFunction.insertId];
            createComment = mysql.format(selectCommentSql, insertValues);
            connection.query(createComment, function (err, resSelectComment){
                if (!resSelectComment){
                    return resExp.status(400).json({ error: 'Erreur sur la selecton du commentaire !' });
                } else {
                    return resExp.status(200).json({ 
                        message: 'Création du commentaire réussie !',
                        resSelectComment
                    });
                }
            })
        }
    })
};

/* Suppression d'un commentaire */
exports.deleteComment = (req, resExp, next) => {
    const postId = req.params['post_id'];
    const commentId = req.params['comment_id'];
    const deleteCommentSql = "DELETE FROM comment WHERE comment.id = ? AND post_id = ?;";
    const insertValues = [commentId, postId];
    deleteComment = mysql.format(deleteCommentSql, insertValues);
    connection.query(deleteComment, function (err, resDeleteCommentFunction) {
        if(!resDeleteCommentFunction) {
            return resExp.status(400).json({ error: 'Suppression de commentaire refusé !' });
        } else {
            return resExp.status(200).json({ message: "Suppression de commentaire réussi !" });
        }
    });
};