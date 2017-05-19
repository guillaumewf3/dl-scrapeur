let config = require('../config.js')
let mysql      = require('mysql')

let connection = mysql.createConnection(config.db)

//sauvegarde une annonce
function save(ad, callback){
    console.log("Saving " + ad.title)
    connection.query(
        'INSERT INTO ads (url, title, description, price, picture, city, zip, isSent, dateAdded) VALUES (?,?,?,?,?,?,?,0,NOW())',
        [ad.url, ad.title, ad.description, ad.price, ad.picture, ad.city, ad.zip],
        function (error, results, fields) {
            if (error) throw error
            callback(results)
        }
    )
}

//retrouve une annonce en bdd en fct de son url
function findByUrl(url, callback){
    connection.query(
        'SELECT * FROM ads WHERE url = ?',
        [url],
        function (error, results, fields){
            callback(results)
        }
    )
}

//change le status "sent" des annonces non-envoyées
function setNewAdsAsOld(callback){
    connection.query(
        'UPDATE ads SET isSent = 1 WHERE isSent = 0',
        function (error, results, fields) {
            if (error) throw error;
            callback()
        }
    )
}

//récupère les nouvelles annonces
function findNewAds(callback){
    connection.query(
        'SELECT * FROM ads WHERE isSent = 0',
        function (error, results, fields){
            callback(results)
        }
    )
}

//ferme la connexion
function closeConnection(){
    connection.end()
}

//rend presque tout disponible
module.exports = {
    save: save,
    closeConnection: closeConnection,
    findByUrl: findByUrl,
    findNewAds: findNewAds,
    setNewAdsAsOld: setNewAdsAsOld
}