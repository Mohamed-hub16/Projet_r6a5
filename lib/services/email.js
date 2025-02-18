'use strict';

const { Service } = require('@hapipal/schmervice');
const nodemailer = require('nodemailer');
const { forEach } = require('../routes/movies');

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
            from: '"MohamedAPP" <noreply@mohamedAPP.com>',
            to: user.mail,
            subject: 'Bienvenue sur la superbe application de Mohamed Mesri (Argent 1 sur Valo)!',
            html: `
                <h1>Bienvenue ${user.firstName}!</h1>
                <p>Je suis ravis de vous compter parmi mes utilisateurs.</p>
                <p>Votre compte a été créé avec succès.</p>
            `
        };

        return this.transporter.sendMail(mailOptions);
    }

    async sendNewMovieNotification(users, movie) {
        for (const user of users) {
            const mailOptions = {
                from: '"MohamedAPP" <noreply@mohamedAPP.com>',
                to: user.mail,
                subject: 'Nouveau film ajouté !',
                html: `
                    <h1>Nouveau film : ${movie.title}</h1>
                    <p>Un nouveau film vient d'être ajouté :</p>
                    <h2>${movie.title}</h2>
                    <p>${movie.description}</p>
                    <p>Réalisé par : ${movie.filmmaker}</p>
                    <p>Date de sortie : ${new Date(movie.releasedDate).toLocaleDateString()}</p>
                `
            };
            
            await this.transporter.sendMail(mailOptions);
        }
    }

    async sendMovieUpdateNotification(users, movie) {
        for (const user of users) {
            const mailOptions = {
                from: '"MohamedAPP" <noreply@mohamedAPP.com>',
                to: user.mail,
                subject: 'Un film en favori a été modifié !',
                html: `
                    <h1>Mise à jour du film : ${movie.title}</h1>
                    <p>Un film dans vos favoris a été modifié :</p>
                    <h2>${movie.title}</h2>
                    <p>${movie.description}</p>
                    <p>Réalisé par : ${movie.filmmaker}</p>
                    <p>Date de sortie : ${new Date(movie.releasedDate).toLocaleDateString()}</p>
                `
            };
            
            await this.transporter.sendMail(mailOptions);
        }
    }

    async sendCSVExport(user, csvBuffer) {
        const mailOptions = {
            from: '"MohamedAPP" <noreply@mohamedAPP.com>',
            to: user.mail,
            subject: 'Export CSV des films',
            text: 'Veuillez trouver ci-joint l\'export CSV de tous les films.',
            attachments: [{
                filename: 'movies_export.csv',
                content: csvBuffer
            }]
        };
        
        return this.transporter.sendMail(mailOptions);
    }
    
};