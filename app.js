let request = require('request')
let cheerio = require('cheerio')

//la première URL dont on va récupérer le code source
let mainUrl = "http://www.imdb.com/chart/moviemeter";

var movies = [];

request(mainUrl, (error, response, body) => {
    if (error){
        console.error(error)
        return false
    }

    let $ = cheerio.load(body)
    let pageTitle = $("h1.header").html()
    console.log(pageTitle)

    let links = $("tbody.lister-list tr")
    console.log(links.length)
    links.each(function(i, element){
        //crée un objet vide pour contenir nos données pour ce film
        let movie = {}

        //titre du film
        let title = $(element).find('td.titleColumn a').html()
        console.log(title)
        movie.title = title

        //url de la page détail de ce film
        let detailUrl = $(element).find('td.titleColumn a').attr("href")
        movie.url = detailUrl

        //année

        //rating

        //ajoute notre objet "movie" à la liste définie plus haut
        movies.push(movie)

        //requête vers la page détail
        //request('http://www.imdb.com'+detailUrl, (error, res, body) => {
        //    console.log(res.statusCode)
        //})
    })
})
