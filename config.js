var config = {
    startUrls: [
        "https://www.leboncoin.fr/bricolage/offres/pays_de_la_loire/?th=1&q=carreau%20de%20ciment",
        "https://www.leboncoin.fr/bricolage/offres/pays_de_la_loire/?th=1&q=parquet",
    ],
    db: {
        host     : 'localhost',
        user     : 'root',
        password : 'root',
        database : 'scrap_materiaux'
    },
    mailer: {
        user: 'yo@gmail.com',
        password: 'yoyoyo'
    }
}

module.exports = config;
