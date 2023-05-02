const nodemailer = require('nodemailer');

//create a transporter for the nodemail package
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.CALM_EMAIL, 
        pass: process.env.CALM_EMAIL_PASSWORD, // generated ethereal password
    },
});

module.exports = {
    transporter,
}