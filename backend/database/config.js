const mysql = require('mysql2');

/* Connexion à MySQL2 */
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
  });
  
db.connect(function(error) {
if (error) {
    console.log("Connexion à MySQL échouée !");
    throw error;
}
console.log("Connexion à MySQL réussi !");
});