let request = require('request')
let cheerio = require('cheerio')
let url = require('url')

function removeWhiteSpaces(str){
    return str.trim()
}

function scrap(url, callback){
    request(url, (error, response, body) => {
        if (error) {
            console.error(error)
            return false
        }

        let ad = {}

        let $ = cheerio.load(body)

        //titre de l'annonce
        let title = $(".adview h1").html()
        ad.title = removeWhiteSpaces(title);

        //prix
        let price = $("h2.item_price").attr("content")
        if (price !== undefined && parseInt(price) !== "NaN"){
            ad.price = parseInt(price)
        }
        else {
            ad.price = null
        }

        callback(ad)
    })
}

module.exports = {
    scrap: scrap
}