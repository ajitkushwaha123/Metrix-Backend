import nodemailer from "nodemailer";
import Mailgen from "mailgen";
import dotenv from "dotenv";
import UserModel from "../models/User.models.js";
import ejs from "ejs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const nodeConfig = {
  host: "smtp.hostinger.com",
  port: 465,
  secure: true, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
};

const transporter = nodemailer.createTransport(nodeConfig);

const MailGenerator = new Mailgen({
  theme: "default",
  product: {
    name: "Mailgen",
    link: "https://mailgen.js",
  },
});

export const registerMail = async (req, res, next) => {
  try {
    let { username, email, subject } = req.body; // Changed `const` to `let`
    const code = req.otp;

    if (!email) {
      return res.status(400).send({ error: "Email is required" });
    }

    if (!username) {
      const emailExist = await UserModel.findOne({ email: email });
      if (emailExist) {
        username = emailExist.username;
      }
    }

    // Path to the EJS template
    const templatePath = path.join(__dirname, "../views/emails/email.ejs");

    // Render the EJS template
    let emailBody = await ejs.renderFile(templatePath, {
      userName: username,
      userEmail: email,
      verificationCode: code,
    });

    const message = {
      from: `"Support" <support@magicscale.in>`, // Use alias email address here
      to: email,
      subject: subject || "Registration Success",
      html: emailBody,
    };

    await transporter.sendMail(message);
    console.log("Email sent successfully");
    res.status(200).send({ msg: "You should receive an email" });
    next();
  } catch (error) {
    console.error("Error sending email:", error); // Log the error details
    if (!res.headersSent) {
      return res
        .status(500)
        .send({ error: "Error sending email", details: error.message });
    }
  }
};
