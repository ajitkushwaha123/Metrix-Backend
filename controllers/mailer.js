import nodemailer from 'nodemailer';
import Mailgen from 'mailgen';
import ENV from '../config.js';

const nodeConfig = {
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
        user: ENV.EMAIL,
        pass: ENV.PASSWORD,
    },
};


// {
//   "username" : "exmaple123",
//   "userEmail" : "admin123",
//   "text" : "",
//   "subject" : "",  
// }

const transporter = nodemailer.createTransport(nodeConfig);

const MailGenerator = new Mailgen({
    theme: "default",
    product: {
        name: "Mailgen",
        link: "https://mailgen.js",
    },
});

export const registerMail = async (req, res) => {
    try {
        const { username, userEmail, text, subject } = req.body;

        const email = {
            body: {
                name: username,
                intro: text || 'Dummy paragraph',
                outro: 'Duummmmmyyyyy2',
            },
        };

        const emailBody = MailGenerator.generate(email);

        const message = {
            from: ENV.EMAIL,
            to: userEmail,
            subject: subject || "Registration Success",
            html: emailBody,
        };

        await transporter.sendMail(message);
        return res.status(200).send({ msg: "You should receive an email" });
    } catch (error) {
        return res.status(500).send({ error: "Error sending email" });
    }
};
