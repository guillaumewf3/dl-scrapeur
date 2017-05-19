let config = require('./config.js')
let listScraper = require('./Scraper/ListScraper')
let detailScraper = require('./Scraper/DetailScraper')
let database = require('./Model/Database')
let mailer = require('./Mailer/Mailer')

//ces 2 variables sont utiles pour savoir si on a fini de traiter
//toutes les pages de détails
let adsCount = 0
let adsHandled = 0

//appelée à la toute fin
function end(){
    database.closeConnection()
    console.log("done")
}

//envoie les nouvelles annonces par email
function sendNewAds(){
    database.findNewAds((newAds) => {

        if (newAds.length > 0){
            console.log("Sending email with " + newAds.length + " new ads")
            mailer.send(newAds, () => {
                database.setNewAdsAsOld(end)
            })
        }
        else {
            console.log("Not sending anything")
            end()
        }
    })
}

//appelée lorsqu'une page de détail est complètement traitée
//si on détermine qu'on a traité toutes les annonces, alors c'est fini
function adHandlingCompleted(){
    adsHandled++
    if (adsHandled === adsCount){
        sendNewAds()
    }
}

//appelée par la DetailScraper
function handleAd(ad) {
    //on vérifie si elle existe déjà en bdd
    database.findByUrl(ad.url, (results) => {
        if (results.length > 0){
            console.log("Already there !")
            adHandlingCompleted()
        }
        else {
            //sauvegarde en bdd
            database.save(ad, adHandlingCompleted)
        }
    })
}

//lance le scraping sur une page détail
function scrapDetailPages(detailUrls){
    detailUrls.forEach(function(url, index){
        //uniquement pour limiter le nbre de requête pendant le dév
        if (index >= 12){
            return
        }
        //on a une nouvelle annonce à traiter...
        adsCount++
        detailScraper.scrap(url, handleAd)
    })
}

//lance le scraping sur les pages de liste
listScraper.scrap(config.startUrls, scrapDetailPages)