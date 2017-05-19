let request = require('request')
let cheerio = require('cheerio')
let url = require('url')

let scrapCallback;
let allDetailUrls = []
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
            let absoluteUrl = url.resolve(listUrl, href)
            detailUrls.push(absoluteUrl)
        })

        console.log("Found " + detailUrls.length + " links on " + listUrl)

        listPageDone(detailUrls)
    })
}

function listPageDone(detailUrls){
    allDetailUrls.push(...detailUrls)
    listPagesDoneCount++
    if (listPagesDoneCount === listPagesCount){
        scrapCallback(allDetailUrls)
    }
}

function scrap(listUrls, callback){
    scrapCallback = callback
    listPagesCount = listUrls.length
    listUrls.forEach(function(listUrl){
        extractDetailUrlsFromListPage(listUrl)
    })
}

module.exports = {
    scrap: scrap
}