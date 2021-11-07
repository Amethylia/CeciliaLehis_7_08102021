const mysql = require('mysql2');

const config = require('../database/config.js');
const connection = mysql.createConnection(config.databaseOptions);

/* Récupération de tous les commentaires */
exports.getAllComments = (req, resExp, next) => {
    const getAllcommentsSql = "SELECT post_id, id FROM comment WHERE post_id = ?;";
    const InsertValue = [req.params.post_id];
    getAllcomments = mysql.format(getAllcommentsSql, InsertValue);
    connection.query(getAllcomments, function (err, resGetAllCommentsFunction) {
        if(!resGetAllCommentsFunction) {
            return resExp.status(400).json({ error: 'Aucun commentaire(s) publié(s) !' });
        } else {
            return resExp.status(200).json({ mesage: "Voici le(s) commentaire(s) publié(s) !" });
        }
    });
}

/* Récupération d'un commentaire */
exports.getComment = (req, resExp, next) => {
    const getPostSql = "SELECT * FROM comment WHERE post_id = ? && id = ?;";
    const InsertValues = [req.params.post_id, req.params.comment_id];
    getPost = mysql.format(getPostSql, InsertValues);
    connection.query(getPost, function (err, resGetPostFunction) {
        console.log(resGetPostFunction);
        if(!resGetPostFunction) {
            return resExp.status(400).json({ error: 'Aucun commentaire récupéré !' });
        } else {
            return resExp.status(200).json({ 
                mesage: "Commentaire récupéré !",
                commentaire: resGetPostFunction[0]["comment"],
                date: resGetPostFunction[0]["date"]
            });
        }
    });
}

/* Création d'un commentaire */
exports.createComment = (req, resExp, next) => {
    const userId = res.UserId;
    const createCommentSql = "INSERT INTO comment (user_id, post_id, comment, date) VALUES (?, ?, ?, ?);";
    const insertValues = [userId, req.params.post_id, req.body.comment, req.body.date];
    createComment = mysql.format(createCommentSql, insertValues);
    connection.query(createComment, function (err, resCreateCommentFunction){
        if (!resCreateCommentFunction){
            return resExp.status(400).json({ error: 'Création du commentaire refusée !' });
        } else {
            return resExp.status(200).json({ message: 'Création du commentaire réussie !' });
        }
    })
};

/* Suppression d'un commentaire */
exports.deleteComment = (req, resExp, next) => {
    const deleteCommentSql = "DELETE FROM comment WHERE post_id = ? && id = ?;";
    const insertValues = [req.params.post_id, req.params.comment_id];
    deleteComment = mysql.format(deleteCommentSql, insertValues);
    connection.query(deleteComment, function (err, resDeleteCommentFunction) {
        if(!resDeleteCommentFunction) {
            return resExp.status(400).json({ error: 'Suppression de commentaire refusé !' });
        } else {
            return resExp.status(200).json({ message: "Suppression de commentaire réussi !" });
        }
    });
};