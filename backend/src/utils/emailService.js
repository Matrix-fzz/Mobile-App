import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Kan't2ekdo anaho l'variables dyl .env m'chargyin
dotenv.config();

// 1. Kanṣaybo "l'transporteur" li ghadi y'tواصل m3a l'servers dyal Gmail
// Ghadi ysta3mel l'email o l'password li 7ettina f .env
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // L'email dyalk men .env
        pass: process.env.EMAIL_PASS, // L' "App Password" dyal 16 7arf men .env
    },
    // Nassi7a: Zid had l'option bach t'éviter chi machakil dyal connexion
    tls: {
        rejectUnauthorized: false
    }
});

/**
 * Fonction bach tṣifet email.
 * @param {string} to L'email dyal l'mosta9bil (e.g., 'user@example.com')
 * @param {string} subject L'3onwan dyal l'risala
 * @param {string} text L'version texte dyal l'risala (fallback)
 * @param {string} html L'version HTML dyal l'risala (l'asassiya)
 */
const sendEmail = async (to, subject, text, html) => {
    try {
        // Kanṣaybo l'objet dyal l'email b l'ma3loumat l'asassiya
        const mailOptions = {
            from: `"Nestify" <${process.env.EMAIL_USER}>`, // Bdel "Your App Name" b smia dyal l'app dyalk
            to: to,
            subject: subject,
            text: text,
            html: html,
        };

        // Kansta3mlo l'transporteur bach nṣifṭo l'email
        await transporter.sendMail(mailOptions);

        console.log(`Email sent successfully to ${to}`);
    } catch (error) {
        console.error(`Error sending email to ${to}:`, error);
        // N9dro n'sifto error bach l'controller y3ref anaho l'email ma mchach
        throw new Error('Failed to send email.');
    }
};

export default sendEmail;