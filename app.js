let config = require('./config.js')
let listScraper = require('./Scraper/ListScraper')
let detailScraper = require('./Scraper/DetailScraper')

function saveAd(ad){
    console.log(ad)
}

function scrapDetailPages(detailUrls){
    detailUrls.forEach(function(url, index){
        if (index >= 3){
            return
        }
        detailScraper.scrap(url, saveAd)
    })
}

listScraper.scrap(config.startUrls, scrapDetailPages)