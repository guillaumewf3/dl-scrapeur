const nodemailer = require('nodemailer');
const config = require('../config')

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.mailer.user,
        pass: config.mailer.password
    }
});

// setup email data with unicode symbols
//le contenu du mail est géré plus loin
let mailOptions = {
    from: '"Guillaume 👻" <machinchoseformation@gmail.com>', // sender address
    to: 'machinchoseformation@gmail.com', // list of receivers
    subject: 'Nouvelles annonces ✔', // Subject line
    //html: '<b>Nouvelles annonces ?</b>' // html body
};

//génère le contenu du message
//aurait du être fait avec nunjucks par exemple
function createMailBody(ads){
    let body = '<table>'
    ads.forEach((ad) => {
        //placeholder image si l'annonce n'en avait pas
        let picUrl = (ad.picture) ? ad.picture : 'https://dummyimage.com/200x200/474447/968d96.png'

        body += '<tr><td>'
        body += '<img style="width:200px" width="200" src="' + picUrl + '">'
        body += '</td><a href="'+ad.url+'">' + ad.title
        body += '</a></td>'
    })
    body += '</table>'

    return body
}

//envoie le mail
function send(newAds, callback) {
    mailOptions.html = createMailBody(newAds)

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message %s sent: %s', info.messageId, info.response);
        callback()
    });
}

//rend uniquement la fonction send() dispo à l'extérieur du module
module.exports = {
    send: send
}