'use strict';

const { Service } = require('@hapipal/schmervice');
const nodemailer = require('nodemailer');

module.exports = class MailService extends Service {

    constructor(server, options) {
        super(server, options);

        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });
    }

    async sendWelcomeEmail(user) {
        const mailOptions = {
            from: '"Your App" <noreply@yourapp.com>',
            to: user.mail,
            subject: 'Bienvenue sur notre application!',
            html: `
                <h1>Bienvenue ${user.firstName}!</h1>
                <p>Nous sommes ravis de vous compter parmi nos utilisateurs.</p>
                <p>Votre compte a été créé avec succès.</p>
            `
        };

        return this.transporter.sendMail(mailOptions);
    }
};