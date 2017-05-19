let request = require('request')
let cheerio = require('cheerio')
let url = require('url')

//la fonction qui sera appelée lorsque toutes les pages de liste auront été scrapées
let scrapCallback = null
let allDetailUrls = []

//utiles pour savoir si on scrapé toutes les pages de liste
let listPagesCount = null
let listPagesDoneCount = 0

function extractDetailUrlsFromListPage(listUrl){
    console.log("Scrape list : ", listUrl)
    request(listUrl, (error, response, body) => {
        if (error) {
            console.error(error)
            return false
        }

        let $ = cheerio.load(body)

        let items = $(".mainList li")
        let detailUrls = []

        items.each(function (i, element) {
            let link = $(element).find('li > a')
            let href = link.attr("href")
            //voir https://nodejs.org/api/url.html#url_url_resolve_from_to
            let absoluteUrl = url.resolve(listUrl, href)
            //on ajoute l'URL dans le tableau
            detailUrls.push(absoluteUrl)
        })

        console.log("Found " + detailUrls.length + " links on " + listUrl)

        listPageDone(detailUrls)
    })
}

function listPageDone(detailUrls){
    //https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Spread_operator
    allDetailUrls.push(...detailUrls)
    listPagesDoneCount++
    //on a fini de scraper les listes...
    if (listPagesDoneCount === listPagesCount){
        scrapCallback(allDetailUrls)
    }
}

function scrap(listUrls, callback){
    //on rend le callback disponible pour les autres méthodes,
    //qui en auront besoin plus tard (voir scrapCallback ci-dessus)
    scrapCallback = callback
    //le nbre de pages à scraper
    listPagesCount = listUrls.length
    listUrls.forEach(function(listUrl){
        extractDetailUrlsFromListPage(listUrl)
    })
}

//on cache tout sauf la fonction scrap()
module.exports = {
    scrap: scrap
}