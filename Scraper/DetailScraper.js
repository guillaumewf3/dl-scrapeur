let request = require('request')
let cheerio = require('cheerio')
let url = require('url')
//pour tenter de résoudre les problèmes d'encodage
//le bon coin est encodé en windows-1252
var iconv = require('iconv-lite');
var windows1252 = require('windows-1252');


function scrap(url, callback){
    request(url, (error, response, body) => {
        if (error) {
            console.error(error)
            return false
        }

        //initialise un objet pour les données de l'annonce
        //on connait déjà son url...
        let ad = {
            url: url
        }

        //decode
        decodedBody = iconv.decode(response.body, "windows-1252");
        let $ = cheerio.load(decodedBody);

        //titre de l'annonce
        let title = $(".adview h1").html()
        title = windows1252.decode(title)
        ad.title = title.toString().trim();

        //prix
        let price = $("h2.item_price").attr("content")
        if (price !== undefined && parseInt(price) !== "NaN"){
            ad.price = parseInt(price) //converti en entier
        }
        else {
            ad.price = null
        }

        //picture
        //les images sont carrément en script, donc regex obligatoire
        let imagesScript = $("section.adview_main .item_photo").next("script").html()
        let imagesUrl = []
        if (imagesScript) {
            let imagesRegex = /images\[\d+\]\s=\s"(.*)"/gi
            let match = imagesRegex.exec(imagesScript)
            while(match !== null) {
                imagesUrl.push(match[1])
                match = imagesRegex.exec(imagesScript)
            }
        }
        ad.pictures = imagesUrl
        //je ne sauvegarde en fait que la première image
        if (ad.pictures.length > 0){
            ad.picture = "https:" + ad.pictures[0]
        }

        //zip
        ad.zip = null
        let address = $('span[itemprop="address"]').html()
        let match = /\d{5}/.exec(address)
        if (match[0]){
            ad.zip = match[0]
        }

        //city
        ad.city = null
        let city = address.replace(/\d{5}/, "")
        ad.city = city

        //description
        let description = $('p[itemprop="description"]').html()
        description = windows1252.decode(description)
        ad.description = description.toString()

        //appelle la fonction passée en argument, en lui donnant l'objet annonce
        callback(ad)
    })
}

module.exports = {
    scrap: scrap
}